import uuid from './uuid'

export default function() {
  return swot();
}

function swot() {
  var swotModel =
  {
    "modelId": "0af5e573-fcab-bf86-695c-0a99761007c7",
    "kind": "swot",
    "date": null,
    "title": "Your SWOT analysis",
    "blocks": [
      {
        "id": "4b8a27ec-6d9d-b22f-25c9-328f2ea365aa",
        "title": "Strengths",
        "x": 12,
        "y": 12,
        "w": 500,
        "h": 330,
        "cards": [
          {
            "id": "237f9f8e-7177-ae59-9804-4c146a1a1797",
            "title": "Some random text here",
            "x": 53,
            "y": 38,
            "w": 250,
            "h": 120,
            "color": "yellow"
          }
        ]
      },
      {
        "id": "eb87c580-f9df-ee55-4191-725fbecf7c1f",
        "title": "Weaknesses",
        "x": 512,
        "y": 12,
        "w": 500,
        "h": 330,
        "cards": [
        ]
      },
      {
        "id": "0b6c6bf9-63f8-0f0b-aae7-376fab65ad3e",
        "title": "Opportunities",
        "x": 12,
        "y": 342,
        "w": 500,
        "h": 330,
        "cards": []
      },
      {
        "id": "0fed57ee-6547-39ca-afe2-f0e33320ceeb",
        "title": "Threats",
        "x": 512,
        "y": 342,
        "w": 500,
        "h": 330,
        "cards": []
      }
    ],
    "cards": []
  };
  return swotModel;
}
