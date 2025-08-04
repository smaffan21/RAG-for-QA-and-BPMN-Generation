# Railway RAG for Ab Ovo

This project is a Retrieval-Augmented Generation (RAG) system for answering questions about Dutch railway transport regulations using the official Network Statement document. It also includes BPMN process modeling capabilities.

## Features

- **Q&A System**: Ask questions about railway regulations and get answers based on the Network Statement document
- **BPMN Generation**: Generate process diagrams using Mermaid syntax based on process descriptions and regulatory context
- **Vector Database**: Efficient semantic search using Chroma vector database with Ollama embeddings

## Files

- **main.py**  
  Main application with interactive menu for Q&A and BPMN generation

- **bpmn_generator.py**  
  Specialized module for generating BPMN process diagrams using Mermaid syntax

- **railway_vector.py**  
  Script for processing the PDF, splitting it into chunks, and creating the vector database for retrieval

- **prorail_network_statement_db/**  
  Contains the vector database built from the Network Statement PDF. Used for efficient semantic search and retrieval.

- **NetworkStatement2026.pdf**  
  The official source document containing railway regulations and information.

- **requirements.txt**  
  List of Python dependencies required to run the project.

## Prerequisites

1. **Python 3.8+** installed on your system
2. **Ollama** installed and running locally
   - Download from: https://ollama.ai/
   - Install and start the Ollama service
3. **Required Ollama Models**:
   - `llama3.2` (for text generation)
   - `mxbai-embed-large` (for embeddings)

## Setup Instructions

### 1. Install Ollama Models

First, pull the required models:

```bash
# Install the text generation model
ollama pull llama3.2

# Install the embedding model
ollama pull mxbai-embed-large
```

### 2. Set Up Python Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Prepare the Vector Database

Run the vector database creation script:

```bash
python railway_vector.py
```

This will:
- Load the NetworkStatement2026.pdf file or whatever your other data source you have
- Split it into chunks for better retrieval
- Create embeddings using the mxbai-embed-large model
- It will store everything in the `prorail_network_statement_db/` directory (change if needed in railway_vector.py)

### 4. Run the Application

```bash
python main.py
```

## How It Works

### Q&A Mode
1. **Question Input**: User asks a question about railway regulations
2. **Document Retrieval**: System searches the vector database for relevant chunks
3. **Context Assembly**: Retrieved chunks are formatted with page numbers
4. **Answer Generation**: LLM generates precise answers based on the retrieved context
5. **Citation**: Answers include source page numbers for verification

### BPMN Generation Mode
1. **Process Description**: User describes a railway process they want to model
2. **Regulatory Retrieval**: System finds relevant regulations and constraints
3. **Diagram Generation**: LLM creates Mermaid BPMN diagram with proper syntax
4. **Syntax Fixing**: Post-processing ensures valid Mermaid syntax
5. **Output**: Clean Mermaid script ready for visualization

## Usage Examples

### Q&A Examples
- **Easy**: "What is the email address for submitting complaints about services offered by ProRail?"
- **Medium**: "Is passenger transport allowed on the freight tracks in the Barendrecht underpass?"
- **Hard**: "What are the different categories of Incidental TCRs?"

### Advanced Q&A Test Case
**Complex Question**: "A railway undertaking wants to operate on the network. What are the three main legal documents they must hold, and what is the minimum insurance coverage they need per event?"

**Expected Answer**: The system should combine information from two different sections:
- (1) a valid operating licence
- (2) a valid safety certificate  
- (3) an Access Agreement
- Insurance value of €10,000,000

**Key Sections to Retrieve**: Page 35 (Section 3.2.2 for the documents) AND Page 37 (Section 3.2.5 for the insurance amount)

### BPMN Examples
- **Simple Process**: "First, the system receives a request for a new train path. Then, it checks for any conflicting requests in the timetable. If there are no conflicts, the path is allocated. If there are conflicts, a coordination process is initiated."

## Output Files

- **output_process.md**: Saved BPMN diagrams in Mermaid format
- **prorail_network_statement_db/**: Vector database files (auto-generated)

## Troubleshooting

1. **Ollama Connection Error**: Make sure Ollama is running (`ollama serve`)
2. **Model Not Found**: Pull the required models using `ollama pull model_name`
3. **PDF Not Found**: Ensure `NetworkStatement2026.pdf` is in the project directory
4. **Import Errors**: Make sure all dependencies are installed (`pip install -r requirements.txt`)

## Notes

- The system is designed to answer questions strictly based on the provided Network Statement document
- BPMN diagrams are generated using Mermaid syntax and can be viewed in VS Code or at mermaid.live
- The vector database is persistent and only needs to be created once
- All answers include source citations for verification 