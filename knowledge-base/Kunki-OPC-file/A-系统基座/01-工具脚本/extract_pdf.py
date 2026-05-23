
import PyPDF2
import sys

def extract_pdf_text(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text() + "\n\n"
    return text

if __name__ == "__main__":
    pdf_path = "D:/ObsidianVaults/MyVault/conversations/conv-1777644786646/运营书籍目录修改(2).pdf"
    text = extract_pdf_text(pdf_path)
    output_path = "D:/ObsidianVaults/MyVault/conversations/conv-1777644786646/extracted_operation_toc.txt"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Extracted PDF text saved to {output_path}")
    print(f"Total characters: {len(text)}")
