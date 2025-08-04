import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from langchain_ollama import OllamaEmbeddings
import pandas as pd

def get_embedding(text, embeddings_model):
    """Get embedding for a single text"""
    return embeddings_model.embed_query(text)

def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def visualize_embeddings(texts, labels, title):
    """Visualize embeddings using t-SNE"""
    # Initialize embeddings model
    embeddings = OllamaEmbeddings(model="mxbai-embed-large")
    
    # Get embeddings for all texts
    print("Generating embeddings...")
    embeddings_list = [get_embedding(text, embeddings) for text in texts]
    
    # Convert to numpy array
    embeddings_array = np.array(embeddings_list)
    
    # Print cosine similarities between original and all others
    print("\nCosine similarities to Original:")
    for i, label in enumerate(labels):
        if label == "Original":
            continue
        sim = cosine_similarity(embeddings_array[0], embeddings_array[i])
        print(f"Original <-> {label}: {sim:.4f}")
    
    n_samples = len(texts)
    perplexity = min(30, n_samples - 1)  # t-SNE requires perplexity < n_samples
    
    print(f"Applying t-SNE with perplexity={perplexity}...")
    tsne = TSNE(n_components=2, random_state=42, perplexity=perplexity)
    embeddings_2d = tsne.fit_transform(embeddings_array)
    
    # Create plot
    plt.figure(figsize=(12, 8))
    
    # Plot points with different colors for original/modified vs others
    colors = ['red' if label in ['Original', 'Modified'] else 'blue' for label in labels]
    sizes = [100 if label in ['Original', 'Modified'] else 50 for label in labels]
    
    plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1], c=colors, s=sizes, alpha=0.6)
    
    # Add labels with arrows
    for i, label in enumerate(labels):
        plt.annotate(label, 
                    (embeddings_2d[i, 0], embeddings_2d[i, 1]),
                    xytext=(5, 5),
                    textcoords='offset points',
                    bbox=dict(facecolor='white', edgecolor='none', alpha=0.7))
    
    # Add distance line between original and modified
    orig_idx = labels.index('Original')
    mod_idx = labels.index('Modified')
    plt.plot([embeddings_2d[orig_idx, 0], embeddings_2d[mod_idx, 0]],
             [embeddings_2d[orig_idx, 1], embeddings_2d[mod_idx, 1]],
             'k--', alpha=0.3)
    
    # Calculate and display the distance
    distance = np.linalg.norm(embeddings_2d[orig_idx] - embeddings_2d[mod_idx])
    plt.title(f"{title}\nDistance between Original and Modified: {distance:.2f}")
    
    plt.grid(True, alpha=0.3)
    plt.show()

def main():
    # Load some reviews from the CSV
    df = pd.read_csv("realistic_restaurant_reviews.csv")
    # Randomly select 5 reviews
    sample_reviews = df.sample(n=5)["Review"].tolist()
    # Use the first review for user modification
    original_review = sample_reviews[0]
    print("\nOriginal Review:")
    print(original_review)
    print("\nPlease enter your modified version of the review (or press Enter to keep it the same):")
    user_modified = input()
    if not user_modified.strip():
        user_modified = original_review
    print("\nModified Review:")
    print(user_modified)
    print("\nOther Reviews:")
    for i, review in enumerate(sample_reviews[1:], 1):
        print(f"\nOther {i}:", review)
    all_texts = [original_review, user_modified] + sample_reviews[1:]
    labels = ["Original", "Modified"] + [f"Other {i+1}" for i in range(len(sample_reviews)-1)]
    visualize_embeddings(all_texts, labels, "Embedding Comparison: Original vs Modified Review")

if __name__ == "__main__":
    main() 