# Railway Network RAG for Q&A and BPMN Generation on 2026 Network Statement

This project is a Retrieval-Augmented Generation (RAG) system for answering questions about Dutch railway transport regulations using the official 2026 Network Statement document done by me, Syed Affan. It also includes BPMN process modeling capabilities for clients.

## Features

- **Modern Web Interface**: Beautiful React-based GUI for easy interaction
- **Q&A System**: Ask questions about railway regulations and get answers based on the Network Statement document
- **BPMN Generation**: Generate process diagrams using Mermaid syntax based on process descriptions and regulatory context
- **Vector Database**: Efficient semantic search using Chroma vector database with Ollama embeddings
- **Real-time Processing**: Live responses with loading indicators and error handling
- **Copy & Download**: Easy copying and downloading of generated content

## Files

### Backend
- **main.py**  
  Command-line interface with interactive menu for Q&A and BPMN generation

- **api_server.py**  
  Flask API server providing REST endpoints for the React frontend

- **bpmn_generator.py**  
  Specialized module for generating BPMN process diagrams using Mermaid syntax

- **railway_vector.py**  
  Script for processing the PDF, splitting it into chunks, and creating the vector database for retrieval

### Frontend
- **frontend/**  
  React application providing a modern web interface for the system

### Data & Config
- **prorail_network_statement_db/**  
  Contains the vector database built from the Network Statement PDF. Used for efficient semantic search and retrieval. _Generated upon running railway_vector.py._

- **NetworkStatement2026.pdf**  
  The official source document containing railway regulations and information.

- **requirements.txt**  
  List of Python dependencies required to run the project.

### Scripts
- **start_gui.bat** / **start_gui.sh**  
  Startup scripts to launch both the API server and React frontend

## Prerequisites

1. **Python 3.8+** installed on your system
2. **Node.js 16+** and **npm** for the React frontend
   - Download from: https://nodejs.org/
3. **Ollama** installed and running locally
   - Download from: https://ollama.ai/
   - Install and start the Ollama service
4. **Required Ollama Models**:
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

### 4. Set Up React Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Return to project root
cd ..
```

### 5. Run the Application

#### Option A: Use Startup Scripts (Recommended)

**Windows:**
``` 
./start_gui.bat
```

**macOS/Linux:**
```bash
chmod +x start_gui.sh
./start_gui.sh
```

#### Option B: Manual Start

**Terminal 1 - Start API Server:**
```bash
python api_server.py
```

**Terminal 2 - Start React Frontend:**
```bash
cd frontend
npm start
```

#### Option C: Command Line Interface Only

```bash
python main.py
```

### 6. Access the Application

- **Web Interface**: http://localhost:3000
- **API Server**: http://localhost:8000
- **Command Line**: Run `python main.py`

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

### Backend Issues
1. **Ollama Connection Error**: Make sure Ollama is running (`ollama serve`)
2. **Model Not Found**: Pull the required models using `ollama pull model_name`
3. **PDF Not Found**: Ensure `NetworkStatement2026.pdf` is in the project directory
4. **Import Errors**: Make sure all dependencies are installed (`pip install -r requirements.txt`)
5. **API Server Error**: Check that port 8000 is available and not blocked by firewall

### Frontend Issues
1. **React Won't Start**: Make sure Node.js and npm are installed (`node --version`, `npm --version`)
2. **Dependencies Error**: Run `npm install` in the frontend directory
3. **Port 3000 Unavailable**: React will automatically suggest an alternative port
4. **API Connection Error**: Ensure the API server is running on port 8000

### General Issues
1. **CORS Errors**: Make sure `flask-cors` is installed and the API server is configured correctly
2. **Slow Responses**: First-time model loading can be slow; subsequent requests should be faster
3. **Empty Responses**: Check that the vector database was created successfully by running `railway_vector.py`

## Notes

- The system is designed to answer questions strictly based on the provided Network Statement document
- BPMN diagrams are generated using Mermaid syntax and can be viewed in VS Code or at mermaid.live
- The vector database is persistent and only needs to be created once
- All answers include source citations for verification
- The React interface provides a modern, user-friendly way to interact with the system
- Both command-line and web interfaces are available for different use cases 
