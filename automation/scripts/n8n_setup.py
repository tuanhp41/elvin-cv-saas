#!/usr/bin/env python3
"""n8n automated setup: credential + import 2 workflows + test Telegram"""
import urllib.request, urllib.error, json, urllib.parse

BASE = "http://localhost:5678/api/v1"
KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTdmNDJlMy0yN2E0LTQyYTgtYjM3NC0xMTkyM2Y2NmYzMDgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYzA2Yzk4OTEtMjJiNi00NmU3LTgxZjItODA1NjM2ZjhhZmNlIiwiaWF0IjoxNzc1OTAwNTczfQ.sKRW-XSZQmDRUTafr2ypVqJ4RY3LQ54bV6eBm_ugkSQ"
BOT  = "8367516949:AAHDDZ5gD7rYxu5L7LMp02aZTydlCeABdWg"
CHAT = "8498124621"
DIR  = "/home/elvin/projects/cv-saas/automation/n8n"

def api(method, path, data=None):
    url = BASE + path
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("X-N8N-API-KEY", KEY)
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return json.loads(e.read())

print("[1] Testing API...")
r = api("GET", "/workflows")
print("   Existing workflows:", len(r.get("data", [])))

print("[2] Creating Telegram credential...")
cred = api("POST", "/credentials", {
    "name": "Elvin_nyzbot",
    "type": "telegramApi",
    "data": {"accessToken": BOT}
})
cred_id = cred.get("id", "")
if cred_id:
    print("   Credential ID:", cred_id)
else:
    print("   Note:", cred.get("message",""), "- checking existing...")
    creds = api("GET", "/credentials")
    for c in creds.get("data", []):
        if "elvin" in c.get("name","").lower() or "telegram" in c.get("name","").lower():
            cred_id = c.get("id","")
            print("   Found existing cred ID:", cred_id)
            break

def import_wf(fname, label):
    print("[*] Importing", label, "...")
    with open(DIR + "/" + fname) as f:
        wf = json.load(f)
    for node in wf.get("nodes", []):
        t = node.get("type", "")
        if "telegram" in t.lower() and cred_id:
            node["credentials"] = {
                "telegramApi": {"id": cred_id, "name": "Elvin_nyzbot"}
            }
    payload = {
        "name": wf.get("name", label),
        "nodes": wf["nodes"],
        "connections": wf["connections"],
        "settings": wf.get("settings", {}),
        "staticData": None
    }
    r = api("POST", "/workflows", payload)
    wid = r.get("id", "")
    if wid:
        print("   ID:", wid)
        ra = api("PATCH", "/workflows/" + wid + "/activate")
        print("   Active:", ra.get("active", ra))
    else:
        print("   Error:", r)
    return wid

import_wf("dashchat-bot.json", "Dashchat Bot")
import_wf("daily-kickoff.json", "Daily Kickoff 19:00")

print("[5] Sending Telegram test...")
msg = urllib.parse.quote("n8n Dashchat OK! Bot @Elvin_nyzbot ready. Go /help to test.")
url = "https://api.telegram.org/bot" + BOT + "/sendMessage?chat_id=" + CHAT + "&text=" + msg
try:
    with urllib.request.urlopen(url, timeout=10) as r:
        res = json.loads(r.read())
        print("   Telegram:", "OK" if res.get("ok") else str(res))
except Exception as e:
    print("   Error:", e)

print("\nALL DONE")
