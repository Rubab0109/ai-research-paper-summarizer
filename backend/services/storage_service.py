from pathlib import Path
import json
from typing import List, Dict, Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
HISTORY_FILE = DATA_DIR / "history.json"


def _read_history() -> List[Dict[str, Any]]:
    if not HISTORY_FILE.exists():
        return []

    try:
        return json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def _write_history(items: List[Dict[str, Any]]) -> None:
    HISTORY_FILE.write_text(
        json.dumps(items, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def save_analysis(record: Dict[str, Any]) -> None:
    items = _read_history()
    items.insert(0, record)
    # Keep local history light.
    items = items[:50]
    _write_history(items)


def list_history() -> List[Dict[str, Any]]:
    items = _read_history()
    # Return smaller objects for history list.
    return [
        {
            "id": item.get("id"),
            "file_name": item.get("file_name"),
            "created_at": item.get("created_at"),
            "paper_title_guess": item.get("analysis", {}).get("paper_title_guess", ""),
            "detected_sections": item.get("text_stats", {}).get("detected_sections", []),
        }
        for item in items
    ]


def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    for item in _read_history():
        if item.get("id") == analysis_id:
            return item
    return None
