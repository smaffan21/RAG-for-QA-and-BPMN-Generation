
# imports
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
import os
import uuid # Used to generate unique IDs for each chunk

# 1. LOAD THE DOCUMENT

# instead of pandas, we use PyPDFLoader to load the document directly and it  loader automatically splits the document by pages
pdf_path = "NetworkStatement2026.pdf" # make sure the PDF is in the same directory
loader = PyPDFLoader(pdf_path)
documents = loader.load()

# 2. CHUNK THE DOCUMENT
# split the loaded pages into smaller, more meaningful chunks, RecursiveCharacterTextSplitter: https://python.langchain.com/api_reference/text_splitters/character/langchain_text_splitters.character.RecursiveCharacterTextSplitter.html
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, # size of each chunk in characters
    chunk_overlap=100  # ohw many characters to overlap between chunks
)

chunks = text_splitter.split_documents(documents)

print(f"Loaded {len(documents)} pages and split them into {len(chunks)} chunks.")

# 3. EMBED AND STORE THE CHUNKS
# initialize embeddings model
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

# vector persistent vector db location 
db_location = "./prorail_network_statement_db"
vector_store = Chroma(
    collection_name="network_statement_2026",
    persist_directory=db_location,
    embedding_function=embeddings
)

# Check if the collection already has documents by trying to get the count
try:
    collection_count = vector_store._collection.count()
    if collection_count == 0:
        print("Creating new vector store and adding documents...")
        # unique IDs for each chunk with UUIDs 
        ids = [str(uuid.uuid4()) for _ in chunks]
        vector_store.add_documents(documents=chunks, ids=ids)
        print("Documents added to the vector store.")
    else:
        print(f"Vector store already exists with {collection_count} documents.")
except Exception as e:
    print("Creating new vector store and adding documents...")
    # unique IDs for each chunk with UUIDs 
    ids = [str(uuid.uuid4()) for _ in chunks]
    vector_store.add_documents(documents=chunks, ids=ids)
    print("Documents added to the vector store.")

# creating retriever that returns top 5 most similar documents
retriever = vector_store.as_retriever(
    search_kwargs={"k": 5} # retrieve top 5 most relevant chunks
)