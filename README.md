
# Campus Autopilot UI

A lightweight announcement form for campus notifications, built with plain HTML, CSS and vanilla JavaScript (no frameworks). Announcements can go to all students or to one classroom, chosen with dependent Academic Year, Branch and Division dropdowns.

## Files

- `index.html`: page structure and form
- `style.css`: styling (responsive, supports light and dark mode)
- `script.js`: dropdown logic, validation and webhook submission

## Setup

1. Open `script.js` and set `WEBHOOK_URL` to your webhook endpoint.
2. Open `index.html` in a browser. No build step is needed.

While `WEBHOOK_URL` is empty, the form validates and logs the payload to the browser console instead of sending it.

## Dropdown logic

- Branch is disabled until an Academic Year is selected.
- Division is disabled until both Academic Year and Branch are selected.
- Changing the year clears branch and division. Changing the branch clears division.
- Only valid divisions are ever shown.

### Division mapping

**First Year (FY)**

| Branch | Divisions |
|---|---|
| CSE | A, B, C |
| CSE-DS | D |
| CSE-AIML | E, F |
| ENTC | G |
| Chemical | H |
| Civil | I |
| Mechanical | J |

**Second Year (SY), Third Year (TY), Fourth Year (Final)**

| Branch | Divisions |
|---|---|
| CSE | A, B, C |
| CSE-DS, CSE-AIML, Civil, Mechanical, ENTC, Chemical | A, B |

The mapping lives in the `DIVISION_MAP` object in `script.js`. Edit it there to change divisions.

## Payload

On submit, a JSON `POST` is sent to the webhook:

```json
{
  "title": "Holiday notice",
  "message": "Campus closed on Friday.",
  "recipientType": "classroom",
  "academicYear": "FY",
  "branch": "Mechanical",
  "division": "J"
}