# Imports
import json

import pandas as pd

from config import *


def init_question_entry(row) -> dict:
    """
    Initiate question entry
    :param row: pandas dataframe row
    :return: dict
    """
    entry = {"license": row["license"],
             "chapter": row["chapter"],
             "question": None,
             "answers": []}
    return entry


def convert_to_html_list(text: str) -> str:
    """
    Convert string with options "a.", "b.", etc. into an HTML list
    :param text: string
    :return: string
    """
    text = '<ol type = "a">' + text
    for s in ["a. ", "b. ", "c. ", "d. "]:
        text = text.replace(s, "<li>")
    text = text.replace("\n", "</li>").replace(" <", "<")
    text = text + "</ol>"
    return text


def get_data() -> None:
    """
    Convert data from RAW_DATA (source: ELWIS PDF files) into a json file
    :return: None
    """

    # Get raw data, remove "error" rows, and
    df = pd.read_excel(RAW_DATA, index_col="q_id")
    df = df[df.option != "ERROR"]

    # Initiate funkschein dictionary
    funkschein_dict = {
        "id": "src-lrc-ubi",
        "title": "funkschein-fragem",
        "copyright": {
            "text": "Wasserstraßen- und Schifffahrtsverwaltung des Bundes",
            "src": "https://www.elwis.de/"
        }
    }

    # Create dictionary with question data
    data = dict()
    for q_id, row in df.iterrows():

        # Initiate entry for q_id if it does not yet exist
        if q_id not in data.keys():
            data[q_id] = init_question_entry(row)

        # Add question text to entry if row contains question
        text = str(row["text"]).strip()
        if row["option"] == "Q":
            data[q_id]["question"] = text

        # Else add option A, B, C, or D
        else:

            # Check if there is a list in the text answer and
            # convert text into an HTML list if necessary
            subset = {"a.", "b.", "c."}
            if len(subset & set(text.split())) == len(subset):
                text = convert_to_html_list(text)

            # Add answer text answer options and specify label
            # Note: "A" is always the correct answer
            data[q_id]["answers"].append({
                "label": text,
                "value": True if row["option"] == "A" else False
            })

    # Convert dict of questions into list of questions
    questions = list()
    for key, val in data.items():
        val["id"] = key
        questions.append(val)

    # Add questions list to funkschein dictionary
    funkschein_dict["questions"] = questions

    # Save dictionary as json file
    with open(JSON_DATA, 'w') as fp:
        json.dump(funkschein_dict, fp, indent=4, ensure_ascii=False)

    print("Saved questions data in", JSON_DATA)

# Run script
if __name__ == '__main__':
    get_data()
