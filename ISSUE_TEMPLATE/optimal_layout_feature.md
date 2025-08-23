### Title:
Add “Optimal Layout” button that checks 12×18 and 13×19 sheets

### Description:
We need a feature that evaluates both 12 × 18 and 13 × 19 sheet sizes and selects the orientation/rotation combination that yields the highest n‑up layout. The calculations should be performed alongside the existing layout logic. If the current setup isn’t optimal, display a green “See optimal layout” button. When the user clicks it, apply the calculated optimal arrangement.

**Proposed implementation:**
- Automatically evaluate n‑up for 12 × 18 and 13 × 19 sheets along with the normal calculations.
- Only show a green “See optimal layout” button when the current layout isn’t optimal.
- On button press, switch to the optimal sheet size, orientation, and rotation.

**Acceptance criteria:**
- System checks both 12 × 18 and 13 × 19 sheet sizes for maximal n‑up.
- “See optimal layout” button appears only when a better arrangement exists.
- Clicking the button applies the optimal layout.
- UI feedback indicates which sheet size and rotation were selected.