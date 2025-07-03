# Railway RAG

This project is a Retrieval-Augmented Generation (RAG) system for answering questions about Dutch railway transport regulations using the official Network Statement document.

## Files

- **prorail_network_statement_db/**  
  Contains the vector database built from the Network Statement PDF. Used for efficient semantic search and retrieval.

- **NetworkStatement2026.pdf**  
  The official source document containing railway regulations and information.

- **railway_vector.py**  
  Script for processing the PDF, splitting it into chunks, and creating the vector database for retrieval.

- **requirements.txt**  
  List of Python dependencies required to run the project.

## How It Works

1. **Vector Database Creation:**  
   `railway_vector.py` processes `NetworkStatement2026.pdf`, splits it into text chunks, and stores their embeddings in `prorail_network_statement_db/`.

2. **Question Answering:**  
   (Assuming you have a main script, e.g., `main_RAG.py`):  
   - The user asks a question.
   - The system retrieves the most relevant chunks from the vector database.
   - An LLM (such as Llama) is prompted with the retrieved context to generate a precise answer.

## Getting Started

1. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

2. **Prepare the vector database:**  
   Run `railway_vector.py` to process the PDF and build the database (if not already present).

3. **Ask questions:**  
   Use your main script (e.g., `main_RAG.py`) to interact with the system and ask questions about the Network Statement.

## Notes

- Make sure you have the required LLM and vector database dependencies installed.
- The project is designed to answer questions strictly based on the provided Network Statement document. 