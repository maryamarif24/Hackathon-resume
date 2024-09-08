
/**
     * Formats a date string (YYYY-MM-DD) into a more readable format (e.g., "January 2020").
     * @param {string} dateStr - The date string to format.
     * @returns {string} - The formatted date string.
     */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, options);
}

/**
 * Handles the form submission, captures user input, and dynamically populates the resume layout.
 */
document.getElementById('resumeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Capture form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    const company = document.getElementById('company').value.trim();
    const role = document.getElementById('role').value.trim();
    const startdate = formatDate(document.getElementById('startdate').value);
    const enddateRaw = document.getElementById('enddate').value;
    const enddate = enddateRaw ? formatDate(enddateRaw) : 'Present';
    const description = document.getElementById('description').value.trim();

    const school = document.getElementById('school').value.trim();
    const degree = document.getElementById('degree').value.trim();
    const graduationdate = formatDate(document.getElementById('graduationdate').value);

    const skillsInput = document.getElementById('skills').value.trim();
    const skills = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);

    const certificationsInput = document.getElementById('certifications').value.trim();
    const certifications = certificationsInput.split(',').map(cert => cert.trim()).filter(cert => cert.length > 0);

    const additionalInfo = document.getElementById('additionalInfo').value.trim();

    // Populate the resume with captured data
    document.getElementById('resumeName').textContent = name;
    document.getElementById('resumeEmail').textContent = `Email: ${email}`;
    document.getElementById('resumePhone').textContent = `Phone: ${phone}`;
    document.getElementById('resumeAddress').textContent = `Address: ${address}`;

    document.getElementById('resumeCompany').textContent = company;
    document.getElementById('resumeRole').textContent = role;
    document.getElementById('resumeStartDate').textContent = startdate;
    document.getElementById('resumeEndDate').textContent = enddate;
    document.getElementById('resumeDescription').textContent = description;

    document.getElementById('resumeSchool').textContent = school;
    document.getElementById('resumeDegree').textContent = degree;
    document.getElementById('resumeGraduationDate').textContent = graduationdate;

    // Populate Skills as a list
    const skillsList = document.getElementById('resumeSkills');
    skillsList.innerHTML = ''; // Clear previous entries
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        skillsList.appendChild(li);
    });

    // Populate Certifications as a list
    const certificationsList = document.getElementById('resumeCertifications');
    certificationsList.innerHTML = ''; // Clear previous entries
    certifications.forEach(cert => {
        const li = document.createElement('li');
        li.textContent = cert;
        certificationsList.appendChild(li);
    });

    // Populate Additional Information
    document.getElementById('resumeAdditionalInfo').textContent = additionalInfo;

    // Display the resume
    document.getElementById('resumeLayout').style.display = 'block';

    // Optionally, scroll to the resume section
    document.getElementById('resumeLayout').scrollIntoView({ behavior: 'smooth' });
});
