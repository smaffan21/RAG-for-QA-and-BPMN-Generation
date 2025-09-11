# api server for react frontend
from flask import Flask, request, jsonify, send_file
import os
from flask_cors import CORS
import sys
import os

# add current directory to python path to import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# import ollama llm & prompt template
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

# import retriever from railway_vector.py file
from railway_vector import retriever
from bpmn_generator import generate_bpmn_from_description as bpmn_generator

app = Flask(__name__)
CORS(app)  # enable cors for react frontend

# using llama 3.2
model = OllamaLLM(model="llama3.2")

# qa template - same as in main.py
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

@app.route('/api/qa', methods=['POST'])
def qa_endpoint():
    """handle q&a requests from frontend"""
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({'error': 'question is required'}), 400
        
        # retrieve relevant documents from vector database
        retrieved_docs = retriever.invoke(question)
        # format context with page numbers for citation
        context = "\n\n".join([f"Source (Page {doc.metadata.get('page', 'N/A')}):\n{doc.page_content}" for doc in retrieved_docs])
        
        # generate answer using llm with retrieved context
        result = qa_chain.invoke({"context": context, "question": question})
        
        return jsonify({
            'answer': result,
            'context': context,
            'sources': len(retrieved_docs)
        })
    
    except Exception as e:
        print(f"error in qa endpoint: {e}")
        return jsonify({'error': 'internal server error'}), 500

@app.route('/api/bpmn', methods=['POST'])
def bpmn_endpoint():
    """handle bpmn generation requests from frontend"""
    try:
        data = request.get_json()
        description = data.get('description', '')
        
        if not description:
            return jsonify({'error': 'description is required'}), 400
        
        # generate mermaid script using bpmn_generator
        mermaid_script = bpmn_generator(description, model)
        
        return jsonify({
            'mermaid_script': mermaid_script,
            'description': description
        })
    
    except Exception as e:
        print(f"error in bpmn endpoint: {e}")
        return jsonify({'error': 'internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'railway rag api is running'})

@app.route('/api/health/ollama', methods=['GET'])
def ollama_health():
    """check if ollama is running and models are available"""
    try:
        # Try to create a model instance to check if Ollama is running
        model = OllamaLLM(model="llama3.2")
        # Try a simple completion to verify model is loaded
        model.invoke("test")
        return jsonify({'status': 'healthy', 'message': 'ollama is running and model is loaded'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 503

@app.route('/api/health/vectordb', methods=['GET'])
def vectordb_health():
    """check if vector database is accessible"""
    try:
        # Try to get collection count to verify DB access
        collection_count = vector_store._collection.count()
        return jsonify({
            'status': 'healthy', 
            'message': f'vector database is accessible with {collection_count} documents'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 503

@app.route('/NetworkStatement2026.pdf')
def serve_pdf():
    """Serve the Network Statement PDF file"""
    try:
        pdf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'NetworkStatement2026.pdf')
        print(f"Attempting to serve PDF from: {pdf_path}")
        if not os.path.exists(pdf_path):
            print(f"PDF file not found at: {pdf_path}")
            return jsonify({'error': 'PDF file not found'}), 404
        
        response = send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=False,
            download_name='NetworkStatement2026.pdf'
        )
        response.headers['Content-Type'] = 'application/pdf'
        return response
    except Exception as e:
        print(f"Error serving PDF: {str(e)}")
        return jsonify({'error': f'Error serving PDF: {str(e)}'}), 500

if __name__ == '__main__':
    print("starting railway rag api server...")
    print("frontend should be accessible at http://localhost:3000")
    print("api server running at http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)
