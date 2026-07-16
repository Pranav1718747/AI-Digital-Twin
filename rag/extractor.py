"""
SentinelOS AI – Document Extraction Pipeline

Enterprise-grade document parsing using PyMuPDF (fitz).
Extracts text, metadata, and handles basic structural
chunking for RAG ingestion.
"""

import logging
from typing import List, Dict, Any, Optional
from uuid import UUID
import io

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

logger = logging.getLogger("sentinel.rag.extractor")


class DocumentChunk:
    """Represents a chunk of text extracted from a document."""
    def __init__(self, text: str, metadata: Dict[str, Any]):
        self.text = text
        self.metadata = metadata

    def to_dict(self) -> dict:
        return {
            "text": self.text,
            "metadata": self.metadata
        }


class DocumentExtractor:
    """
    Handles extracting text and metadata from uploaded documents (PDFs).
    """

    @staticmethod
    def extract_pdf(file_bytes: bytes, file_name: str, tenant_id: UUID, uploaded_by: UUID) -> List[DocumentChunk]:
        """
        Extract text from a PDF file using PyMuPDF.
        Splits the document into chunks (by page for simplicity, but can be enhanced).
        """
        if fitz is None:
            logger.warning("PyMuPDF (fitz) is not installed. Returning empty extraction.")
            return []

        chunks = []
        try:
            # Open PDF from memory
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            
            # Extract document-level metadata
            doc_metadata = doc.metadata or {}
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text("text").strip()
                
                if text:
                    # Create a chunk for each page
                    chunk_metadata = {
                        "tenant_id": str(tenant_id),
                        "file_name": file_name,
                        "uploaded_by": str(uploaded_by),
                        "page_number": page_num + 1,
                        "total_pages": len(doc),
                        "author": doc_metadata.get("author", "Unknown"),
                        "title": doc_metadata.get("title", file_name),
                    }
                    chunks.append(DocumentChunk(text=text, metadata=chunk_metadata))
                    
            doc.close()
            logger.info(f"Extracted {len(chunks)} chunks from {file_name}")
            
        except Exception as e:
            logger.error(f"Failed to extract text from PDF {file_name}: {e}")
            raise
            
        return chunks

    @staticmethod
    def chunk_text(text: str, max_chunk_size: int = 1000, overlap: int = 100) -> List[str]:
        """
        A naive text splitter for splitting large blocks of text into smaller chunks.
        Used if page-level extraction yields chunks that are too large.
        """
        if not text:
            return []
            
        words = text.split()
        chunks = []
        
        i = 0
        while i < len(words):
            chunk_words = words[i:i + max_chunk_size]
            chunks.append(" ".join(chunk_words))
            i += max_chunk_size - overlap
            
        return chunks
