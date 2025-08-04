from langchain_core.prompts import ChatPromptTemplate
from railway_vector import retriever # importing retriever

def bpmn_format_context(documents):
    """
    A simpler formatter for BPMN generation, as we just need a block of text.
    """
    context_str = "\n\n".join([doc.page_content for doc in documents])
    return context_str

# specialized prompt for generating bpmn diagrams
bpmn_prompt_template = """
You are an expert in business process modeling for the railway industry. 
Your task is to create a BPMN-style flowchart using Mermaid syntax based on a user's process description and relevant regulatory context.

Follow these instructions precisely:
1.  Analyze the user's 'Process Description' to understand the main sequence of tasks.
2.  Review the 'Regulatory Context' to identify any rules, constraints, or conditions that must be represented as decision points (gateways) in the process.
3.  Generate a Mermaid script for a flowchart (`graph TD;`).
4.  Represent tasks using rectangular nodes: `id["Task Name"]` (node IDs must be alphanumeric, no quotes).
5.  Represent decision points using diamond-shaped nodes: `id{{Decision?}}` (node IDs must be alphanumeric, no quotes).
6.  **All edges must use `-->` for arrows. Do NOT use `|>`, `>`, or any other arrow style.**
7.  To label an edge, use: `A --|label|--> B`.
8.  Never use quoted strings as node IDs (e.g., do NOT write `A --> "Begin Process"`). Instead, use `A --> B["Begin Process"]` where `B` is a unique alphanumeric node ID.
9.  Do NOT use curly braces `{{}}` for logic, nesting, or blocks. Mermaid does NOT support nested logic or blocks inside curly braces. Each node and edge must be a single line.
10.  Do NOT use colons, arrows, or custom logic inside edge labels. Only use the format: `A --|label|--> B`.
11.  Only output the Mermaid code, starting with `graph TD;`.
12.  **Only include the main steps and decisions described by the user. Do NOT add extra steps, sub-processes, or details not present in the user's description. Do NOT include unconnected node definitions.**
 
---
Here is a correct example for a process with a decision:

```mermaid
graph TD
    Step1["Receive Request"] --> Step2{{Conflict?}}
    Step2 --|Yes|--> Step3["Initiate Process"]
    Step2 --|No|--> Step4["Allocate Path"]
```

---
Here is the Regulatory Context from the Network Statement:
{regulatory_context}

---
Here is the user's Process Description:
{process_description}

---
Mermaid Script:
graph TD;
    ...
"""

bpmn_prompt = ChatPromptTemplate.from_template(bpmn_prompt_template)

def fix_mermaid_syntax(mermaid_code):
    import re
    lines = mermaid_code.split('\n')
    fixed_lines = []
    node_id_counter = 1
    edge_node_ids = set()
    node_def_lines = []
    # first pass: fix lines, collect edge node ids and node definitions
    for line in lines:
        # remove lines with curly braces used for logic or nesting (not valid in mermaid)
        if re.search(r'\{.*:.*\}', line) or re.match(r'.*\{\s*$', line) or re.match(r'.*\}\s*$', line):
            continue  # skip lines with curly brace logic or block
        # remove lines with colons/arrows inside edge labels (not valid)
        if re.search(r'--[^-]*:.*-->', line):
            continue
        # fix arrows: replace '|>' or '>' with '-->'
        line = re.sub(r'\|>|(?<!-)>(?!-)', '-->', line)
        # fix labeled edges with wrong arrow
        line = re.sub(r'--\|([^|]+)\|>+', r'--|\1|-->', line)
        # fix quoted node ids: A --> "Label" => A --> B["Label"]
        match = re.match(r'^(\s*\w+)\s*-->\s*"([^"]+)"', line)
        if match:
            src = match.group(1)
            label = match.group(2)
            node_id = f"auto{node_id_counter}"
            node_id_counter += 1
            line = f'{src} --> {node_id}["{label}"]'
        # collect edge node ids
        edge_match = re.match(r'^\s*(\w+)\s*(--\|[^|]+\|)?-->\s*(\w+)', line)
        if edge_match:
            edge_node_ids.add(edge_match.group(1))
            edge_node_ids.add(edge_match.group(3))
        # collect node definition lines for later filtering
        if re.match(r'^\s*\w+\[.*\]\s*$', line) or re.match(r'^\s*\w+\{\{.*\}\}\s*$', line):
            node_def_lines.append(line)
            continue  # don't add node definitions yet
        # only allow valid mermaid node/edge definitions or graph header
        if re.match(r'^\s*\w+\s*(--\|[^|]+\|)?-->9*\w+(\[.*\]|\{\{.*\}\})?;?$', line) or re.match(r'^\s*graph TD;?$', line):
            fixed_lines.append(line)
    # second pass: add only node definitions that are referenced in edges
    for node_line in node_def_lines:
        node_id = re.match(r'^\s*(\w+)', node_line).group(1)
        if node_id in edge_node_ids:
            fixed_lines.append(node_line)
    return '\n'.join(fixed_lines)

# generates mermaid bpmn script using rag
def generate_bpmn_from_description(description: str, model):
    """
    1. Retrieves context based on the user's description.
    2. Uses an LLM with a specialized prompt to generate the Mermaid script.
    """
    
    print("Retrieving relevant regulations for your process...")
    
    # 1. use the retriever to find relevant rules and constraints
    retrieved_docs = retriever.invoke(description)
    context = bpmn_format_context(retrieved_docs)

    # 2. create the chain with the bpmn prompt and the llm
    bpmn_chain = bpmn_prompt | model

    print("Asking the LLM to generate the BPMN diagram...")
    # 3. invoke the chain to get the mermaid script
    response = bpmn_chain.invoke({
        "regulatory_context": context,
        "process_description": description
    })

    # 4. clean up the llm output to extract only the mermaid code
    try:
        # llms often wrap their code output in ```mermaid ... ```
        mermaid_code = response.split("```mermaid")[1].split("```", 1)[0]
        mermaid_code = mermaid_code.strip()
    except IndexError:
        # if the llm didn't use the wrapper, return the raw response
        mermaid_code = response.strip()
    # post-process to fix common mermaid syntax errors
    mermaid_code = fix_mermaid_syntax(mermaid_code)
    return mermaid_code