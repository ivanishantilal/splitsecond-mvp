import time
import streamlit as st

st.set_page_config(page_title="SplitSecond MVP", page_icon="💸", layout="wide")

# ---------- Initialize session state ----------
defaults = {
    "step": 1,
    "num_people": 3,
    "people": ["", "", ""],
    "num_items": 3,
    "items_data": [
        {"name": "", "price": 0.0},
        {"name": "", "price": 0.0},
        {"name": "", "price": 0.0},
    ],
    "assignments": {},
    "payment_confirmed": False,
    "split_mode": "Split equally",
    "bill_payer": "",
    "receipt_scanned": False,
    "people_scanned": False,
    "tax_amount": 0.0,
    "tip_amount": 0.0,
    "auth_verified": False,
}

for key, value in defaults.items():
    if key not in st.session_state:
        st.session_state[key] = value


# ---------- Helper functions ----------
def set_step(step_number: int):
    st.session_state["step"] = step_number


def get_valid_people():
    return [p.strip() for p in st.session_state["people"] if p.strip()]


def get_valid_items():
    return [item for item in st.session_state["items_data"] if item["name"].strip()]


def get_subtotal():
    return sum(item["price"] for item in get_valid_items())


def get_total_bill():
    return get_subtotal() + st.session_state["tax_amount"] + st.session_state["tip_amount"]


def get_all_cost_lines():
    """Returns normal items plus tax/tip pseudo-items for split-by-items mode."""
    valid_items = get_valid_items().copy()

    if st.session_state["tax_amount"] > 0:
        valid_items.append({"name": "Tax", "price": st.session_state["tax_amount"]})

    if st.session_state["tip_amount"] > 0:
        valid_items.append({"name": "Tip", "price": st.session_state["tip_amount"]})

    return valid_items


def calculate_totals():
    valid_people = get_valid_people()
    totals = {person: 0 for person in valid_people}

    if not valid_people:
        return totals

    if st.session_state["split_mode"] == "Split equally":
        total_bill = get_total_bill()
        equal_share = total_bill / len(valid_people) if valid_people else 0

        for person in valid_people:
            totals[person] = equal_share

    else:  # Split by items
        all_lines = get_all_cost_lines()
        for item in all_lines:
            assigned = st.session_state["assignments"].get(item["name"], [])
            if assigned:
                split_amount = item["price"] / len(assigned)
                for person in assigned:
                    totals[person] += split_amount

    return totals


def calculate_settlements():
    totals = calculate_totals()
    payer = st.session_state["bill_payer"]
    settlements = []

    if payer and payer in totals:
        for person, amount in totals.items():
            if person != payer and amount > 0:
                settlements.append(f"{person} pays {payer} €{amount:.2f}")

    return get_total_bill(), settlements


def simulate_receipt_scan():
    with st.spinner("Scanning receipt..."):
        time.sleep(1.5)

    scanned_items = [
        {"name": "Ribeye Steak", "price": 38.00},
        {"name": "Caesar Salad", "price": 14.50},
        {"name": "Iced Tea", "price": 4.00},
        {"name": "Sparkling Water", "price": 6.00},
        {"name": "Chocolate Lava Cake", "price": 12.00},
    ]

    st.session_state["items_data"] = scanned_items
    st.session_state["num_items"] = len(scanned_items)
    st.session_state["tax_amount"] = 7.45
    st.session_state["tip_amount"] = 0.0
    st.session_state["receipt_scanned"] = True
    st.success("Receipt scanned successfully.")


def simulate_people_scan():
    with st.spinner("Scanning nearby devices..."):
        time.sleep(1.5)

    scanned_people = ["Alex", "Jordan", "Taylor", "Casey", "Sam"]
    st.session_state["people"] = scanned_people
    st.session_state["num_people"] = len(scanned_people)
    st.session_state["people_scanned"] = True
    st.success("Nearby people detected.")


def allocation_preview(item_name, item_price):
    assigned = st.session_state["assignments"].get(item_name, [])
    if assigned:
        return item_price / len(assigned)
    return item_price


# ---------- Styling ----------
st.markdown(
    """
    <style>
    .big-title {
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 0.2rem;
    }
    .subtitle {
        font-size: 1.2rem;
        color: #667085;
        margin-bottom: 1.2rem;
    }
    .section-card {
        border: 1px solid #E5E7EB;
        border-radius: 18px;
        padding: 20px;
        margin-bottom: 18px;
        background: #FFFFFF;
    }
    .soft-card {
        border: 1px solid #E5E7EB;
        border-radius: 16px;
        padding: 16px;
        background: #F8FAFC;
        margin-bottom: 12px;
    }
    .chip-note {
        display: inline-block;
        background: #EEF4FF;
        color: #155EEF;
        padding: 8px 14px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.95rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ---------- Header ----------
st.markdown('<div class="big-title">SplitSecond MVP</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">💸 Split your bill in seconds</div>', unsafe_allow_html=True)
st.progress(st.session_state["step"] / 6)

step_names = {
    1: "Step 1: Receipt",
    2: "Step 2: People",
    3: "Step 3: Choose Split Mode",
    4: "Step 4: Assign Items",
    5: "Step 5: Summary",
    6: "Step 6: Confirm Payment",
}
st.subheader(step_names[st.session_state["step"]])


# ---------- Step 1: Receipt ----------
if st.session_state["step"] == 1:
    top_left, top_mid, top_right = st.columns([5, 1.5, 1.5])

    with top_mid:
        if st.button("📷 Scan Receipt", use_container_width=True):
            simulate_receipt_scan()

    with top_right:
        if st.button("＋ Add Sample Items", use_container_width=True):
            st.session_state["items_data"] = [
                {"name": "Pasta", "price": 14.00},
                {"name": "Pizza", "price": 16.50},
                {"name": "Fries", "price": 6.00},
            ]
            st.session_state["num_items"] = 3

    st.markdown("### Receipt Items")
    st.caption("List all items and their costs from the bill.")

    num_items = st.number_input(
        "Number of items",
        min_value=1,
        max_value=20,
        value=st.session_state["num_items"],
        step=1,
    )
    st.session_state["num_items"] = num_items

    while len(st.session_state["items_data"]) < num_items:
        st.session_state["items_data"].append({"name": "", "price": 0.0})
    while len(st.session_state["items_data"]) > num_items:
        st.session_state["items_data"].pop()

    for i in range(num_items):
        c1, c2 = st.columns([4, 1])
        st.session_state["items_data"][i]["name"] = c1.text_input(
            f"Item {i+1} name",
            value=st.session_state["items_data"][i]["name"],
            key=f"item_name_{i}",
            label_visibility="collapsed",
            placeholder=f"Item {i+1} name",
        )
        st.session_state["items_data"][i]["price"] = c2.number_input(
            f"Price {i+1}",
            min_value=0.0,
            value=float(st.session_state["items_data"][i]["price"]),
            step=0.5,
            key=f"item_price_{i}",
            label_visibility="collapsed",
        )

    st.markdown("### Taxes & Tips")
    tax_col, tip_col = st.columns(2)
    with tax_col:
        st.session_state["tax_amount"] = st.number_input(
            "Tax / Fees", min_value=0.0, value=float(st.session_state["tax_amount"]), step=0.5
        )
    with tip_col:
        st.session_state["tip_amount"] = st.number_input(
            "Tip", min_value=0.0, value=float(st.session_state["tip_amount"]), step=0.5
        )

    subtotal = get_subtotal()
    total = get_total_bill()

    a, b, c = st.columns(3)
    a.metric("Subtotal", f"€{subtotal:.2f}")
    b.metric("Tax + Fees", f"€{st.session_state['tax_amount']:.2f}")
    c.metric("Total", f"€{total:.2f}")

    _, next_col = st.columns([5, 2])
    with next_col:
        if st.button("Continue to People →", use_container_width=True):
            st.session_state["payment_confirmed"] = False
            st.session_state["auth_verified"] = False
            set_step(2)


# ---------- Step 2: People ----------
elif st.session_state["step"] == 2:
    header_left, scan_col, add_col = st.columns([5, 1.5, 1.5])

    with scan_col:
        if st.button("📡 Scan Nearby", use_container_width=True):
            simulate_people_scan()

    with add_col:
        if st.button("＋ Add Person", use_container_width=True):
            st.session_state["people"].append("")
            st.session_state["num_people"] = len(st.session_state["people"])

    st.markdown("### Who’s Splitting?")
    st.caption("Add everyone who will be sharing this bill.")

    num_people = st.number_input(
        "Number of people",
        min_value=1,
        max_value=12,
        value=st.session_state["num_people"],
        step=1,
    )
    st.session_state["num_people"] = num_people

    while len(st.session_state["people"]) < num_people:
        st.session_state["people"].append("")
    while len(st.session_state["people"]) > num_people:
        st.session_state["people"].pop()

    cols = st.columns(2)
    for i in range(num_people):
        with cols[i % 2]:
            st.session_state["people"][i] = st.text_input(
                f"Person {i+1}",
                value=st.session_state["people"][i],
                key=f"person_{i}",
            )

    col1, col2 = st.columns([1, 2])
    with col1:
        if st.button("← Back to Receipt", use_container_width=True):
            set_step(1)
    with col2:
        if st.button("Continue to Split Mode →", use_container_width=True):
            st.session_state["payment_confirmed"] = False
            st.session_state["auth_verified"] = False
            set_step(3)


# ---------- Step 3: Choose Split Mode ----------
elif st.session_state["step"] == 3:
    valid_people = get_valid_people()
    valid_items = get_valid_items()

    if not valid_people:
        st.warning("Please add at least one participant before continuing.")
    elif not valid_items:
        st.warning("Please add at least one receipt item before continuing.")
    else:
        st.session_state["split_mode"] = st.radio(
            "How do you want to split the bill?",
            ["Split equally", "Split by items"],
            index=0 if st.session_state["split_mode"] == "Split equally" else 1,
            horizontal=True,
            key="split_mode_radio",
        )

        if st.session_state["split_mode"] == "Split equally":
            st.info("The full bill, including taxes and tips, will be divided equally.")
        else:
            st.info("You’ll assign each item, tax, and tip to the relevant participants.")

    col1, col2 = st.columns([1, 2])
    with col1:
        if st.button("← Back to People", use_container_width=True):
            set_step(2)
    with col2:
        if st.button("Continue →", use_container_width=True):
            st.session_state["payment_confirmed"] = False
            st.session_state["auth_verified"] = False
            if st.session_state["split_mode"] == "Split equally":
                set_step(5)
            else:
                set_step(4)


# ---------- Step 4: Assign Items ----------
elif st.session_state["step"] == 4:
    valid_people = get_valid_people()
    base_items = get_valid_items()
    all_lines = get_all_cost_lines()

    st.markdown("### Assign Items")
    st.caption("Tap people to assign them to an item. Shared items split automatically.")

    if not valid_people:
        st.warning("Please add at least one participant.")
    elif not all_lines:
        st.warning("Please add at least one item.")
    else:
        for i, item in enumerate(all_lines):
            assigned = st.multiselect(
                f"{item['name']} (€{item['price']:.2f})",
                valid_people,
                default=st.session_state["assignments"].get(item["name"], []),
                key=f"assign_{i}",
            )
            st.session_state["assignments"][item["name"]] = assigned

            per_person = allocation_preview(item["name"], item["price"])
            st.markdown(
                f'<div class="chip-note">€{per_person:.2f} / person</div>',
                unsafe_allow_html=True,
            )
            st.markdown("---")

    col1, col2 = st.columns([1, 2])
    with col1:
        if st.button("← Back", use_container_width=True):
            set_step(3)
    with col2:
        if st.button("Continue to Summary →", use_container_width=True):
            st.session_state["payment_confirmed"] = False
            st.session_state["auth_verified"] = False
            set_step(5)


# ---------- Step 5: Summary ----------
elif st.session_state["step"] == 5:
    valid_people = get_valid_people()
    valid_items = get_valid_items()
    totals = calculate_totals()
    total_bill, settlements = calculate_settlements()

    st.markdown("### Final Settlement")

    left, right = st.columns([1.2, 1])

    with left:
        st.markdown("#### Per Person Breakdown")
        cols = st.columns(len(totals)) if totals else []
        if totals:
            for i, (person, total) in enumerate(totals.items()):
                cols[i].metric(person, f"€{total:.2f}")

        st.markdown("### Who paid the bill upfront?")
        if valid_people:
            default_index = 0
            if st.session_state["bill_payer"] in valid_people:
                default_index = valid_people.index(st.session_state["bill_payer"])

            st.session_state["bill_payer"] = st.selectbox(
                "Select payer",
                valid_people,
                index=default_index,
            )
            st.success(f"💳 {st.session_state['bill_payer']} paid the bill")

    with right:
        st.markdown("#### Payment Summary")
        st.write(f"Subtotal: €{get_subtotal():.2f}")
        st.write(f"Tax & Fees: €{st.session_state['tax_amount']:.2f}")
        st.write(f"Tip: €{st.session_state['tip_amount']:.2f}")
        st.write(f"*Total Charged: €{total_bill:.2f}*")
        st.write(f"Mode: {st.session_state['split_mode']}")

    if st.session_state["split_mode"] == "Split by items":
        st.markdown("#### Item Breakdown")
        for item in get_all_cost_lines():
            assigned = st.session_state["assignments"].get(item["name"], [])
            if assigned:
                st.write(f"*{item['name']}* (€{item['price']:.2f}) → {', '.join(assigned)}")
            else:
                st.write(f"*{item['name']}* (€{item['price']:.2f}) → Not assigned")

    if st.session_state["bill_payer"]:
        st.markdown("#### Suggested Settlements")
        for settlement in settlements:
            st.info(f"💸 {settlement}")

    col1, col2 = st.columns([1, 2])
    with col1:
        if st.button("← Back", use_container_width=True):
            if st.session_state["split_mode"] == "Split equally":
                set_step(3)
            else:
                set_step(4)
    with col2:
        if st.button("Continue to Payment →", use_container_width=True):
            st.session_state["payment_confirmed"] = False
            st.session_state["auth_verified"] = False
            set_step(6)


# ---------- Step 6: Confirm Payment ----------
elif st.session_state["step"] == 6:
    totals = calculate_totals()
    total_bill, settlements = calculate_settlements()

    st.markdown("### Confirm Payment")

    cols = st.columns(len(totals)) if totals else []
    if totals:
        for i, (person, total) in enumerate(totals.items()):
            cols[i].metric(person, f"€{total:.2f}")

    st.markdown("#### Settlement Instructions")
    if settlements:
        for settlement in settlements:
            st.info(f"💸 {settlement}")
    else:
        st.write("No settlement instructions available yet.")

    st.markdown("#### Authentication")
    auth_col1, auth_col2 = st.columns(2)

    with auth_col1:
        if st.button("🪪 Authenticate with Face ID", use_container_width=True):
            with st.spinner("Verifying biometric authentication..."):
                time.sleep(1.2)
            st.session_state["auth_verified"] = True

    with auth_col2:
        if st.button("🔒 Authenticate with Fingerprint", use_container_width=True):
            with st.spinner("Verifying fingerprint..."):
                time.sleep(1.2)
            st.session_state["auth_verified"] = True

    if st.session_state["auth_verified"]:
        st.success("Authentication successful.")

    st.markdown("#### Split Details")
    st.write(f"Mode: {st.session_state['split_mode']}")
    st.write(f"Total bill: €{total_bill:.2f}")
    if st.session_state["bill_payer"]:
        st.write(f"Paid upfront by: {st.session_state['bill_payer']}")

    if st.button("💳 Confirm & Settle Payment", use_container_width=True, disabled=not st.session_state["auth_verified"]):
        st.session_state["payment_confirmed"] = True

    if st.session_state["payment_confirmed"]:
        st.success("✅ Payment settled successfully!")
        st.balloons()

    if st.button("← Back to Summary", use_container_width=True):
        set_step(5)