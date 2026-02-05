
import json

# Translation Maps
CATEGORY_MAP = {
    "Brand": "Brand Health",
    "Comparativa General": "General Comparison",
    "Producto": "Product Features",
    "Por Competidor": "Competitor Analysis",
    "Transaccionales": "Transactional Queries",
    "Comerciales": "Commercial Intent",
    "Informacionales": "Informational Queries"
}

REASON_MAP = {
    "trigger en sección de riesgos": "High-risk context detected",
    "acción regulatoria (pay)": "Regulatory action (Payment)",
    "acción regulatoria (settlement)": "Regulatory settlement",
    "acción regulatoria (fine)": "Regulatory fine",
    "trigger + brand en misma oración": "Negative keyword + Brand co-occurrence",
    "warning trigger en contexto relevante": "Warning keyword in relevant context",
    "trigger en contexto relevante": "Trigger in relevant context",
    "acción regulatoria": "Regulatory action",
    "Sin triggers negativos detectados": "No negative triggers detected",
    "Marca aparece pero posición no determinable": "Brand mentioned (unknown rank)",
    "Marca en posición 1 (top 3)": "Brand ranked #1 (Top 3)",
    "Trigger crítico detectado": "Critical trigger detected",
    "Trigger warning detectado": "Warning trigger detected"
}

def translate_reason(text):
    for k, v in REASON_MAP.items():
        if k in text:
            text = text.replace(k, v)
    return text

def translate_data():
    with open("dashboard/data/data.json", "r") as f:
        data = json.load(f)
    
    for record in data:
        # Translate Category
        if record["category_name"] in CATEGORY_MAP:
            record["category_name"] = CATEGORY_MAP[record["category_name"]]
            
        # Translate Classification Reason
        record["classification_reason"] = translate_reason(record["classification_reason"])
        
        # Translate Trigger Detail Reasons
        for detail in record["triggers_detail"]:
            detail["reason"] = translate_reason(detail["reason"])

    with open("dashboard/data/data_en.json", "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    translate_data()
