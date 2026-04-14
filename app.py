import time
import streamlit as st

st.set_page_config(page_title="SplitSecond MVP", page_icon="💸", layout="wide")


# =========================================================
# SESSION STATE SETUP
# =========================================================
DEFAULT_STATE = {
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
    "is_logged_in": False,
    "account_created": False,
    "user_name": "",
    "user_email": "",
    "payment_method_linked": True,
    "biometrics_enabled": True,
    "occasion_name": "",
    "group_name": "",
    "nearby_joined": False,
}


def initialize_session_state():
    """Initialize all required session-state variables once."""
    for key, value in DEFAULT_STATE.items():
        if key not in st.session_state:
            st.session_state[key] = value


# =========================================================
# GENERAL HELPERS
# =========================================================
def set_step(step_number: int):
    """Move the user to a different app step."""
    st.session_state["step"] = step_number


def reset_confirmation_flags():
    """Reset payment/auth state when moving to a new flow stage."""
    st.session_state["payment_confirmed"] = False
    st.session_state["auth_verified"] = False


def get_valid_people():
    """Return only non-empty participant names."""
    return [person.strip() for person in st.session_state["people"] if person.strip()]


def get_valid_items():
    """Return only non-empty receipt items."""
    return [item for item in st.session_state["items_data"] if item["name"].strip()]


def get_subtotal():
    """Calculate subtotal of user-entered receipt items."""
    return sum(item["price"] for item in get_valid_items())


def get_total_bill():
    """Calculate full bill including tax and tip."""
    return get_subtotal() + st.session_state["tax_amount"] + st.session_state["tip_amount"]


def get_all_cost_lines():
    """
    Return receipt items plus tax and tip as pseudo-items.
    This is useful for item-based splitting.
    """
    lines = get_valid_items().copy()

    if st.session_state["tax_amount"] > 0:
        lines.append({"name": "Tax", "price": st.session_state["tax_amount"]})

    if st.session_state["tip_amount"] > 0:
        lines.append({"name": "Tip", "price": st.session_state["tip_amount"]})

    return lines


# =========================================================
# SPLITTING / SETTLEMENT LOGIC
# =========================================================
def calculate_totals():
    """
    Compute how much each participant owes.

    - Equal split: divide full bill evenly.
    - Item-based split: divide each assigned item among selected participants.
    """
    valid_people = get_valid_people()
    totals = {person: 0 for person in valid_people}

    if not valid_people:
        return totals

    if st.session_state["split_mode"] == "Split equally":
        total_bill = get_total_bill()
        equal_share = total_bill / len(valid_people)

        for person in valid_people:
            totals[person] = equal_share

    else:
        for item in get_all_cost_lines():
            assigned_people = st.session_state["assignments"].get(item["name"], [])
            if assigned_people:
                split_amount = item["price"] / len(assigned_people)
                for person in assigned_people:
                    totals[person] += split_amount

    return totals


def calculate_settlements():
    """
    Create settlement instructions based on who paid the bill upfront.

    Example:
    - Leo pays Ivani €18.11
    """
    totals = calculate_totals()
    payer = st.session_state["bill_payer"]
    settlements = []

    if payer and payer in totals:
        for person, amount in totals.items():
            if person != payer and amount > 0:
                settlements.append(f"{person} pays {payer} €{amount:.2f}")

    return get_total_bill(), settlements


def allocation_preview(item_name, item_price):
    """
    Show how much each selected person would pay for one item.
    Used in the item assignment page.
    """
    assigned_people = st.session_state["assignments"].get(item_name, [])
    if assigned_people:
        return item_price / len(assigned_people)
    return item_price


# =========================================================
# SIMULATED FINTECH FEATURES
# =========================================================
def simulate_receipt_scan():
    """Simulate OCR-based receipt scanning and auto-populate sample items."""
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
    """Simulate proximity-based participant detection."""
    with st.spinner("Scanning nearby devices..."):
        time.sleep(1.5)

    scanned_people = ["Alex", "Jordan", "Taylor", "Casey", "Sam"]
    st.session_state["people"] = scanned_people
    st.session_state["num_people"] = len(scanned_people)
    st.session_state["people_scanned"] = True
    st.success("Nearby people detected.")


def simulate_group_scan():
    """Simulate creating a shared split group and adding nearby participants."""
    with st.spinner("Starting split and scanning nearby participants..."):
        time.sleep(1.5)

    st.session_state["nearby_joined"] = True
    st.session_state["people"] = ["Alex", "Jordan", "Taylor"]
    st.session_state["num_people"] = 3
    st.success("Split created. Nearby participants joined the group.")


# =========================================================
# UI STYLING / HEADER
# =========================================================
def apply_styling():
    """Inject basic custom CSS used across the app."""
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


STEP_NAMES = {
    1: "Step 1: Welcome",
    2: "Step 2: Start a Split",
    3: "Step 3: Receipt",
    4: "Step 4: People",
    5: "Step 5: Choose Split Mode",
    6: "Step 6: Assign Items",
    7: "Step 7: Summary",
    8: "Step 8: Confirm Payment",
}


def render_header():
    """Render common app header and progress indicator."""
    st.markdown('<div class="big-title">SplitSecond MVP</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">💸 Split your bill in seconds</div>', unsafe_allow_html=True)
    st.progress(st.session_state["step"] / 8)
    st.subheader(STEP_NAMES[st.session_state["step"]])


# =========================================================
# STEP 1: WELCOME
# =========================================================
def render_step_welcome():
    left, right = st.columns([1.1, 1])

    with left:
        st.markdown("### Welcome to SplitSecond")
        st.write("Log in or create an account to start a shared payment session.")
        st.write("This simulates the pre-setup needed for linked payment methods and biometric verification.")

        auth_mode = st.radio(
            "Choose an option",
            ["Log In", "Create Account"],
            horizontal=True,
        )

        if auth_mode == "Log In":
            st.session_state["user_email"] = st.text_input(
                "Email",
                value=st.session_state["user_email"],
                placeholder="name@example.com",
            )
            st.text_input("Password", type="password", placeholder="Enter password")

            if st.button("Log In", use_container_width=True):
                st.session_state["is_logged_in"] = True
                st.session_state["account_created"] = True

                if not st.session_state["user_name"]:
                    st.session_state["user_name"] = "Ivani"
                if not st.session_state["user_email"]:
                    st.session_state["user_email"] = "ivani@example.com"

                st.success("Logged in successfully.")
                set_step(2)

        else:
            st.session_state["user_name"] = st.text_input(
                "Full Name",
                value=st.session_state["user_name"],
                placeholder="Your full name",
            )
            st.session_state["user_email"] = st.text_input(
                "Email Address",
                value=st.session_state["user_email"],
                placeholder="name@example.com",
            )
            st.text_input("Create Password", type="password", placeholder="Create password")

            st.session_state["payment_method_linked"] = st.checkbox(
                "Simulate linked payment method",
                value=st.session_state["payment_method_linked"],
            )
            st.session_state["biometrics_enabled"] = st.checkbox(
                "Simulate biometrics enabled",
                value=st.session_state["biometrics_enabled"],
            )

            if st.button("Create Account", use_container_width=True):
                st.session_state["is_logged_in"] = True
                st.session_state["account_created"] = True
                st.success("Account created successfully.")
                set_step(2)

    with right:
        st.markdown("### Account Status")
        st.info(f"User: {st.session_state['user_name'] or 'Not set'}")
        st.info(f"Email: {st.session_state['user_email'] or 'Not set'}")
        st.info(f"Payment Method Linked: {'Yes' if st.session_state['payment_method_linked'] else 'No'}")
        st.info(f"Biometrics Enabled: {'Yes' if st.session_state['biometrics_enabled'] else 'No'}")


# =========================================================
# STEP 2: START A SPLIT
# =========================================================
def render_step_start_split():
    left, right = st.columns([1.1, 1])

    with left:
        st.markdown("### Start a Split")
        st.write("Create a group session before scanning the receipt and settling the bill.")

        st.session_state["occasion_name"] = st.text_input(
            "What's the occasion?",
            value=st.session_state["occasion_name"],
            placeholder="Dinner with Friends",
        )

        st.session_state["group_name"] = st.text_input(
            "Group name",
            value=st.session_state["group_name"],
            placeholder="Friday Dinner Crew",
        )

        if st.button("📡 Start Split & Scan Nearby", use_container_width=True):
            simulate_group_scan()

        if st.button("Continue to Receipt →", use_container_width=True):
            reset_confirmation_flags()
            set_step(3)

    with right:
        st.markdown("### Group Preview")
        st.info(f"Host: {st.session_state['user_name'] or 'Current user'}")
        st.info(f"Occasion: {st.session_state['occasion_name'] or 'Not set'}")
        st.info(f"Group: {st.session_state['group_name'] or 'Not set'}")

        participants = get_valid_people()
        if participants:
            st.markdown("#### Participants")
            for person in participants:
                st.write(f"- {person}")
        else:
            st.write("No participants added yet.")

    if st.button("← Back to Welcome"):
        set_step(1)


# =========================================================
# STEP 3: RECEIPT
# =========================================================
def render_step_receipt():
    _, scan_col, sample_col = st.columns([5, 1.5, 1.5])

    with scan_col:
        if st.button("📷 Scan Receipt", use_container_width=True):
            simulate_receipt_scan()

    with sample_col:
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
        col_name, col_price = st.columns([4, 1])
        st.session_state["items_data"][i]["name"] = col_name.text_input(
            f"Item {i+1} name",
            value=st.session_state["items_data"][i]["name"],
            key=f"item_name_{i}",
            label_visibility="collapsed",
            placeholder=f"Item {i+1} name",
        )
        st.session_state["items_data"][i]["price"] = col_price.number_input(
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
            "Tax / Fees",
            min_value=0.0,
            value=float(st.session_state["tax_amount"]),
            step=0.5,
        )
    with tip_col:
        st.session_state["tip_amount"] = st.number_input(
            "Tip",
            min_value=0.0,
            value=float(st.session_state["tip_amount"]),
            step=0.5,
        )

    subtotal = get_subtotal()
    total = get_total_bill()

    col_a, col_b, col_c = st.columns(3)
    col_a.metric("Subtotal", f"€{subtotal:.2f}")
    col_b.metric("Tax + Fees", f"€{st.session_state['tax_amount']:.2f}")
    col_c.metric("Total", f"€{total:.2f}")

    back_col, next_col = st.columns([1, 2])
    with back_col:
        if st.button("← Back", use_container_width=True):
            set_step(2)
    with next_col:
        if st.button("Continue to People →", use_container_width=True):
            reset_confirmation_flags()
            set_step(4)


# =========================================================
# STEP 4: PEOPLE
# =========================================================
def render_step_people():
    _, scan_col, add_col = st.columns([5, 1.5, 1.5])

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

    back_col, next_col = st.columns([1, 2])
    with back_col:
        if st.button("← Back to Receipt", use_container_width=True):
            set_step(3)
    with next_col:
        if st.button("Continue to Split Mode →", use_container_width=True):
            reset_confirmation_flags()
            set_step(5)


# =========================================================
# STEP 5: CHOOSE SPLIT MODE
# =========================================================
def render_step_split_mode():
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

    back_col, next_col = st.columns([1, 2])
    with back_col:
        if st.button("← Back to People", use_container_width=True):
            set_step(4)
    with next_col:
        if st.button("Continue →", use_container_width=True):
            reset_confirmation_flags()
            if st.session_state["split_mode"] == "Split equally":
                set_step(7)
            else:
                set_step(6)


# =========================================================
# STEP 6: ASSIGN ITEMS
# =========================================================
def render_step_assign_items():
    valid_people = get_valid_people()
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

    back_col, next_col = st.columns([1, 2])
    with back_col:
        if st.button("← Back", use_container_width=True):
            set_step(5)
    with next_col:
        if st.button("Continue to Summary →", use_container_width=True):
            reset_confirmation_flags()
            set_step(7)


# =========================================================
# STEP 7: SUMMARY
# =========================================================
def render_step_summary():
    valid_people = get_valid_people()
    totals = calculate_totals()
    total_bill, settlements = calculate_settlements()

    st.markdown("### Final Settlement")

    left, right = st.columns([1.2, 1])

    with left:
        st.markdown("#### Per Person Breakdown")
        cols = st.columns(len(totals)) if totals else []
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
        st.write(f"**Total Charged: €{total_bill:.2f}**")
        st.write(f"Mode: {st.session_state['split_mode']}")
        st.write(f"Occasion: {st.session_state['occasion_name'] or 'Not set'}")
        st.write(f"Group: {st.session_state['group_name'] or 'Not set'}")

    if st.session_state["split_mode"] == "Split by items":
        st.markdown("#### Item Breakdown")
        for item in get_all_cost_lines():
            assigned = st.session_state["assignments"].get(item["name"], [])
            if assigned:
                st.write(f"**{item['name']}** (€{item['price']:.2f}) → {', '.join(assigned)}")
            else:
                st.write(f"**{item['name']}** (€{item['price']:.2f}) → Not assigned")

    if st.session_state["bill_payer"]:
        st.markdown("#### Suggested Settlements")
        for settlement in settlements:
            st.info(f"💸 {settlement}")

    back_col, next_col = st.columns([1, 2])
    with back_col:
        if st.button("← Back", use_container_width=True):
            if st.session_state["split_mode"] == "Split equally":
                set_step(5)
            else:
                set_step(6)
    with next_col:
        if st.button("Continue to Payment →", use_container_width=True):
            reset_confirmation_flags()
            set_step(8)


# =========================================================
# STEP 8: CONFIRM PAYMENT
# =========================================================
def render_step_confirm_payment():
    totals = calculate_totals()
    total_bill, settlements = calculate_settlements()

    st.markdown("### Confirm Payment")

    cols = st.columns(len(totals)) if totals else []
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
    st.write(f"Occasion: {st.session_state['occasion_name'] or 'Not set'}")
    st.write(f"Group: {st.session_state['group_name'] or 'Not set'}")

    if st.button(
        "💳 Confirm & Settle Payment",
        use_container_width=True,
        disabled=not st.session_state["auth_verified"],
    ):
        st.session_state["payment_confirmed"] = True

    if st.session_state["payment_confirmed"]:
        st.success("✅ Payment settled successfully!")
        st.balloons()

    if st.button("← Back to Summary", use_container_width=True):
        set_step(7)


# =========================================================
# MAIN ROUTER
# =========================================================
def main():
    initialize_session_state()
    apply_styling()
    render_header()

    step = st.session_state["step"]

    if step == 1:
        render_step_welcome()
    elif step == 2:
        render_step_start_split()
    elif step == 3:
        render_step_receipt()
    elif step == 4:
        render_step_people()
    elif step == 5:
        render_step_split_mode()
    elif step == 6:
        render_step_assign_items()
    elif step == 7:
        render_step_summary()
    elif step == 8:
        render_step_confirm_payment()


if __name__ == "__main__":
    main()