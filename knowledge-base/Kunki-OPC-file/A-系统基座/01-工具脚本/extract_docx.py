
from docx import Document
import sys
import os

def extract_docx_text(docx_path):
    doc = Document(docx_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

if __name__ == "__main__":
    docx_path = "D:/ObsidianVaults/MyVault/conversations/conv-1777644786646/《我的第一只数字龙虾：OpenClaw 从入门到精通》-全书_5.1修改版(1).docx"
    text = extract_docx_text(docx_path)
    output_path = "D:/ObsidianVaults/MyVault/conversations/conv-1777644786646/extracted_lobster_book.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Extracted text saved to {output_path}")
    print(f"Total characters: {len(text)}")
