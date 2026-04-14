import streamlit as st

st.set_page_config(page_title="SplitSecond MVP", page_icon="💸", layout="centered")

st.title("SplitSecond MVP")
st.markdown("### 💸 Split your bill in seconds")

# 1. Add Participants
st.header("1. Add Participants")

num_people = st.number_input(
    "Number of people",
    min_value=1,
    max_value=10,
    value=3,
    step=1
)

people = []

for i in range(num_people):
    name = st.text_input(f"Person {i+1} name", key=f"name_{i}")
    if name.strip():
        people.append(name.strip())

# 2. Add Items
st.header("2. Add Items")

items = []

num_items = st.number_input(
    "Number of items",
    min_value=1,
    max_value=20,
    value=3,
    step=1
)

for i in range(num_items):
    col1, col2 = st.columns(2)

    item_name = col1.text_input(f"Item {i+1} name", key=f"item_{i}")
    item_price = col2.number_input(
        f"Price {i+1}",
        min_value=0.0,
        value=0.0,
        step=0.5,
        key=f"price_{i}"
    )

    if item_name.strip():
        items.append({
            "name": item_name.strip(),
            "price": item_price
        })

# 3. Assign Items
st.header("3. Assign Items")

assignments = {}

if people and items:
    for idx, item in enumerate(items):
        assigned = st.multiselect(
            f"Who shares '{item['name']}' (€{item['price']:.2f})?",
            people,
            key=f"assign_{idx}"
        )
        assignments[item["name"]] = assigned
else:
    st.info("Add participants and items first.")

# 4. Calculate Split
st.header("4. Calculate Split")

totals = {person: 0 for person in people}

for item in items:
    assigned = assignments.get(item["name"], [])
    if assigned:
        split_amount = item["price"] / len(assigned)
        for person in assigned:
            totals[person] += split_amount

st.subheader("Final Amounts")

if totals:
    for person, total in totals.items():
        st.metric(label=person, value=f"€{total:.2f}")
else:
    st.write("No totals to show yet.")

# 5. Confirm Payment
st.header("5. Confirm Payment")

if st.button("Confirm & Settle Payment"):
    st.success("✅ Payment settled successfully!")