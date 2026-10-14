"""Creates a SYNTHETIC demo dataset (backend/data/emails.csv). Replace it with a real dataset for real results."""
import random, csv
from pathlib import Path
random.seed(42)
P = lambda *a: random.choice(a)
def spam():
    t = random.randint(0, 6)
    link = P("http://bit.ly/x%d" % random.randint(100,999), "www.claim-prize-now.com/win", "http://secure-verify-account.net/login", "https://cheap-meds-online.biz/buy")
    if t == 0: return f"Subject: {P('CONGRATULATIONS','You WON','WINNER')}!!! Claim your FREE ${random.randint(500,9000)} prize\nDear customer, you have been selected as a lucky winner. Click here to claim your cash prize NOW: {link} Offer expires in 24 hours. ACT NOW!"
    if t == 1: return f"Subject: URGENT: Your account has been suspended\nWe detected suspicious activity. Verify your password immediately or your account will be closed. Login here: {link} Final notice."
    if t == 2: return f"Subject: Limited time offer - {random.randint(50,90)}% OFF\nBuy cheap meds online, no prescription needed! Special bonus for new customers. Order today: {link} Unsubscribe not available."
    if t == 3: return f"Subject: Make money from home\nEarn ${random.randint(2,9)*1000} per week working just {random.randint(1,4)} hours a day. No experience required. Join now at {link} Guaranteed income!"
    if t == 4: return f"Subject: Business proposal\nI am a barrister representing a late client with ${random.randint(2,30)} million USD in unclaimed funds. Send your bank details and 10% is yours. Reply urgently and keep this confidential."
    if t == 5: return f"Subject: Your package could not be delivered\nPay a small fee of $1.99 to reschedule delivery. Confirm your card details here {link} within 24 hours or the parcel will be returned."
    return f"Subject: Hot singles waiting\nFREE membership, click here to chat now {link} Limited spots. Exclusive offer just for you, don't miss out, call now!"
def ham():
    t = random.randint(0, 6); n = P("Priya","Rahul","Anita","Sam","Meera","John","Kiran"); d = P("Monday","Tuesday","Wednesday","Thursday","Friday")
    if t == 0: return f"Subject: Meeting on {d}\nHi {n}, can we move the project review to {d} at {random.randint(9,17)}:00? I have shared the updated slides in our team folder. Thanks, see you then."
    if t == 1: return f"Subject: Lunch this week?\nHey {n}, are you free for lunch on {d}? There is a new place near the office. Let me know what works for you."
    if t == 2: return f"Subject: Invoice {random.randint(1000,9999)} attached\nHello, please find the invoice for last month's services attached. Payment is due within 30 days. Let me know if you have any questions."
    if t == 3: return f"Subject: Assignment submission\nDear {n}, please submit your report before {d}. The marking scheme is on the course portal: https://university.edu/course/{random.randint(100,999)} Regards, Professor."
    if t == 4: return f"Subject: Your order has shipped\nHi {n}, your order #{random.randint(10000,99999)} has shipped and will arrive on {d}. Track it any time from your account page. Thank you for shopping with us."
    if t == 5: return f"Subject: Weekend plans\nHi {n}, we are planning a small birthday dinner on Saturday evening. Hope you can join us. Please confirm by {d}. Love, Anita"
    return f"Subject: Weekly newsletter\nHere are this week's top articles on data science and engineering. Read more on our blog: https://blog.example.com/post/{random.randint(1,500)} You can unsubscribe at any time from settings."
rows = [(spam(), "spam") for _ in range(900)] + [(ham(), "ham") for _ in range(1500)]
# realistic noise: a few ham with urgent words, a few spam that sound calm
rows += [(f"Subject: Urgent - server maintenance\nHi team, please act now and verify your password reset before Friday. Link: https://intranet.company.com/reset", "ham") for _ in range(40)]
rows += [(f"Subject: Quick question\nHello, I saw your profile and have an opportunity that pays well. Visit www.easy-income-hub.com to learn more when you can.", "spam") for _ in range(40)]
random.shuffle(rows)
out = Path(__file__).parent / "data" / "emails.csv"; out.parent.mkdir(exist_ok=True)
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["text", "label"]); w.writerows(rows)
print("Wrote", out, len(rows), "rows")
