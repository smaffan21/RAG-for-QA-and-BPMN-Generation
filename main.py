# import ollama llm & prompt template
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
import json
# import retriever from vector.py file
from railway_vector import retriever
from bpmn_generator import generate_bpmn_from_description as bpmn_generator


# using llama 3.2
model = OllamaLLM(model="llama3.2")

def run_qa_session():
    """Handles the Question & Answer session."""
    # q&a prompt and chain
    qa_template = """
    You are an expert Q&A system for railway transport regulations in the Netherlands.
    Your task is to answer the user's question by following these steps:
    1.  First, identify the single most direct and primary answer to the question from the provided context. State this answer clearly and concisely.
    2.  After providing the direct answer, look through ALL the context provided. If there are any important exceptions, conditions, or related details (like different rules for specific routes or situations), add a section called "Additional Context" and briefly list them.
    3.  Base your entire response ONLY on the provided context. Do not add information or reasoning that is not present.
    4.  If the context does not contain a direct answer, state that you cannot find the information in the provided document.
    5.  Cite the source page number(s) for your information.

    Here is the context:
    {context}

    Here is the question:
    {question}
    """
    qa_prompt = ChatPromptTemplate.from_template(qa_template)
    qa_chain = qa_prompt | model

    while True:
        print("\nQ&A Mode:")
        question = input("Ask a question about the Network Statement (or type 'back' to return to menu): ")
        if question.lower() == 'back':
            break

        # retrieve relevant documents from vector database
        retrieved_docs = retriever.invoke(question)
        # format context with page numbers for citation
        context = "\n\n".join([f"Source (Page {doc.metadata.get('page', 'N/A')}):\n{doc.page_content}" for doc in retrieved_docs])
        # alternatively, the page uuid could be kept (not context page number) and be used as evidence to what is retrieved  
        
        # generate answer using llm with retrieved context
        result = qa_chain.invoke({"context": context, "question": question})
        print("\nAnswer:")
        print(result)
        print("\n--------------")

def run_bpmn_session():
    """Handles the BPMN Generation session."""
    print("\nBPMN Generation Mode:")
    description = input("Describe the process you want to model (or type 'back' to return to menu):\n> ")
    if description.lower() == 'back':
        return

    # call the specialist function from bpmn_generator.py
    mermaid_script = bpmn_generator(description, model)
    
    print("\nGenerated Mermaid Script:")
    print(mermaid_script)
    print("--------------------------------")
    print("\nTip: Copy the script above and paste it into a Mermaid viewer like the one in VS Code or mermaid.live")

    # ask the user if they want to save the file
    save_choice = input("Do you want to save this script to a file? (y/n): ").lower()
    if save_choice == 'y':
        filename = "output_process.md"
        with open(filename, "w") as f: # wrapping the mermaid script in ```mermaid tags
            f.write(f"```mermaid\n{mermaid_script}\n```")
        print(f"Script saved as {filename}")

# --- main application loop ---
if __name__ == "__main__":
    while True:
        print("\n\n===== Ab Ovo Railway RAG System =====")
        print("1. Ask a question about the Network Statement (Q&A)")
        print("2. Generate a BPMN Process Model")
        print("q. Quit")
        choice = input("Choose an option: ")

        if choice == "1":
            run_qa_session()
        elif choice == "2":
            run_bpmn_session()
        elif choice.lower() == "q":
            print("Quitting...")
            break
        else:
            print("Invalid choice. Please try again.")