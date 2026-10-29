(function () {
  'use strict';

  // ---- Configuration -------------------------------------------------------
  // Set this to your existing webhook endpoint.
  var WEBHOOK_URL = '';

  // ---- Data: the single source of truth for dropdown options ---------------
  var ACADEMIC_YEARS = [
    { value: 'FY', label: 'First Year (FY)' },
    { value: 'SY', label: 'Second Year (SY)' },
    { value: 'TY', label: 'Third Year (TY)' },
    { value: 'Final', label: 'Fourth Year (Final Year)' }
  ];
  var BRANCHES = ['CSE', 'CSE-DS', 'CSE-AIML', 'Civil', 'Mechanical', 'ENTC', 'Chemical'];

  var UPPER_YEAR_DIVISIONS = {
    'CSE': ['A', 'B', 'C'],
    'CSE-DS': ['A', 'B'],
    'CSE-AIML': ['A', 'B'],
    'Civil': ['A', 'B'],
    'Mechanical': ['A', 'B'],
    'ENTC': ['A', 'B'],
    'Chemical': ['A', 'B']
  };

  var DIVISION_MAP = {
    FY: {
      'CSE': ['A', 'B', 'C'],
      'CSE-DS': ['D'],
      'CSE-AIML': ['E', 'F'],
      'ENTC': ['G'],
      'Chemical': ['H'],
      'Civil': ['I'],
      'Mechanical': ['J']
    },
    SY: UPPER_YEAR_DIVISIONS,
    TY: UPPER_YEAR_DIVISIONS,
    Final: UPPER_YEAR_DIVISIONS
  };

  // ---- Pure helpers (no DOM) -----------------------------------------------
  function getDivisions(year, branch) {
    var byBranch = Object.prototype.hasOwnProperty.call(DIVISION_MAP, year) ? DIVISION_MAP[year] : null;
    if (!byBranch || !Object.prototype.hasOwnProperty.call(byBranch, branch)) return [];
    return byBranch[branch].slice();
  }

  function validateAnnouncement(data) {
    var errors = {};
    if (!data.title || !data.title.trim()) errors.title = 'Enter a title.';
    if (!data.message || !data.message.trim()) errors.message = 'Enter a message.';
    if (data.recipientType !== 'all_students' && data.recipientType !== 'classroom') {
      errors.recipientType = 'Choose who should receive this announcement.';
    }
    if (data.recipientType === 'classroom') {
      var yearOk = ACADEMIC_YEARS.some(function (y) { return y.value === data.academicYear; });
      if (!yearOk) errors.academicYear = 'Select an academic year.';
      if (!data.branch) errors.branch = 'Select a branch.';
      else if (BRANCHES.indexOf(data.branch) === -1) errors.branch = 'Select a valid branch.';
      if (!errors.academicYear && !errors.branch) {
        var valid = getDivisions(data.academicYear, data.branch);
        if (!valid.length) errors.division = 'No divisions are available for this year and branch.';
        else if (!data.division) errors.division = 'Select a division.';
        else if (valid.indexOf(data.division) === -1) errors.division = 'Division ' + data.division + ' does not exist for this year and branch.';
      } else if (!data.division) {
        errors.division = 'Select a division.';
      }
    }
    return errors;
  }

  function buildPayload(data) {
    var isClass = data.recipientType === 'classroom';
    return {
      title: data.title.trim(),
      message: data.message.trim(),
      recipientType: data.recipientType,
      academicYear: isClass ? data.academicYear : null,
      branch: isClass ? data.branch : null,
      division: isClass ? data.division : null
    };
  }

  // Exposed for testing.
  window.CampusAutopilot = {
    DIVISION_MAP: DIVISION_MAP, getDivisions: getDivisions,
    validateAnnouncement: validateAnnouncement, buildPayload: buildPayload
  };

  if (typeof document === 'undefined') return;

  // ---- DOM -----------------------------------------------------------------
  var form = document.getElementById('announcementForm');
  var yearSel = document.getElementById('academicYear');
  var branchSel = document.getElementById('branch');
  var divSel = document.getElementById('division');
  var divHint = document.getElementById('divisionHint');
  var classroomBox = document.getElementById('classroomFields');
  var submitBtn = document.getElementById('submitBtn');
  var statusEl = document.getElementById('formStatus');
  var isSubmitting = false;

  function fillSelect(select, placeholder, options) {
    select.innerHTML = '';
    var ph = document.createElement('option');
    ph.value = '';
    ph.textContent = placeholder;
    select.appendChild(ph);
    options.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      select.appendChild(opt);
    });
    select.value = '';
  }

  function resetBranch() {
    fillSelect(branchSel, 'Select Branch', BRANCHES.map(function (b) { return { value: b, label: b }; }));
    branchSel.disabled = !yearSel.value;
  }

  function resetDivision() {
    fillSelect(divSel, 'Select Division', []);
    divSel.disabled = true;
    divHint.textContent = '';
  }

  function populateDivisions() {
    resetDivision();
    if (!yearSel.value || !branchSel.value) return;
    var list = getDivisions(yearSel.value, branchSel.value);
    if (!list.length) {
      var yearLabel = yearSel.options[yearSel.selectedIndex].textContent.replace(/\s*\(.*\)/, '');
      divHint.textContent = 'No divisions available for this branch in ' + yearLabel;
      return;
    }
    fillSelect(divSel, 'Select Division', list.map(function (d) { return { value: d, label: 'Division ' + d }; }));
    divSel.disabled = false;
  }

  function showErrors(errors) {
    ['title', 'message', 'academicYear', 'branch', 'division'].forEach(function (k) {
      var el = document.getElementById(k + 'Error');
      var field = document.getElementById(k);
      if (el) el.textContent = errors[k] || '';
      if (field) field.classList.toggle('invalid', !!errors[k]);
    });
  }

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = 'status' + (kind ? ' ' + kind : '');
  }

  function recipientType() {
    return form.querySelector('input[name="recipientType"]:checked').value;
  }

  function readForm() {
    return {
      title: document.getElementById('title').value,
      message: document.getElementById('message').value,
      recipientType: recipientType(),
      academicYear: yearSel.value,
      branch: branchSel.value,
      division: divSel.value
    };
  }

  // ---- Events (each bound once) --------------------------------------------
  yearSel.addEventListener('change', function () {
    resetBranch();
    resetDivision();
    showErrors({});
  });

  branchSel.addEventListener('change', function () {
    populateDivisions();
    showErrors({});
  });

  Array.prototype.forEach.call(form.querySelectorAll('input[name="recipientType"]'), function (r) {
    r.addEventListener('change', function () {
      classroomBox.hidden = recipientType() !== 'classroom';
      showErrors({});
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (isSubmitting) return;
    var data = readForm();
    var errors = validateAnnouncement(data);
    showErrors(errors);
    if (Object.keys(errors).length) {
      setStatus('Fix the highlighted fields and try again.', 'fail');
      return;
    }
    var payload = buildPayload(data);
    if (!WEBHOOK_URL) {
      setStatus('Validated. Set WEBHOOK_URL in script.js to send this payload.', 'ok');
      console.log('Payload:', payload);
      return;
    }
    isSubmitting = true;
    submitBtn.disabled = true;
    setStatus('Sending…');
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('Server responded with ' + res.status);
      setStatus('Announcement sent.', 'ok');
      form.reset();
      classroomBox.hidden = true;
      init();
    }).catch(function (err) {
      setStatus('Could not send the announcement: ' + err.message, 'fail');
    }).then(function () {
      isSubmitting = false;
      submitBtn.disabled = false;
    });
  });

  function init() {
    fillSelect(yearSel, 'Select Academic Year', ACADEMIC_YEARS);
    resetBranch();
    resetDivision();
  }
  init();
})();
