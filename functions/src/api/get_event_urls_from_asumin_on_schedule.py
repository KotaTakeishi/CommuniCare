from firebase_functions import scheduler_fn
from firebase_admin import firestore
from firebase_admin import firestore
import requests
from bs4 import BeautifulSoup
from datetime import datetime

@scheduler_fn.on_schedule(
    schedule="every day 21:40",
    timezone=scheduler_fn.Timezone("Asia/Tokyo"),
    memory=512,
)
def get_event_urls_from_asumin_on_schedule(schedule_event: scheduler_fn.ScheduledEvent) -> None:
    date = datetime.now().strftime("%Y.%m.%d")

    response = requests.get("https://www.fnvc.jp/event/result/2")
    content = response.content

    soup = BeautifulSoup(content, "html.parser")
    events_ul = soup.select(".news-block ul")[0]
    events = events_ul.select("li")
    if len(events) == 0:
        return None

    for event in events:
        posted_date = event.find("span", class_="date").text # type: ignore
        if posted_date == date:
            event_url = "https://www.fnvc.jp" + event.find("a").get("href") # type: ignore
            db = firestore.client()
            event_ref = db.collection("eventUrls")
            event_ref.add(
                {
                    "url": event_url,
                    "createdAt": firestore.SERVER_TIMESTAMP,
                    "updatedAt": firestore.SERVER_TIMESTAMP,
                }
            )
    return None