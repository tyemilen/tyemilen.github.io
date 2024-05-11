const URL = `https://api.github.com/users/tyemilen/repos`;
const projectsContainer = document.getElementById('about-projects');

projectsContainer.textContent = 'Loading...';

async function fetchProjects() {
    const projects = await fetch(URL).then(r => r.json());

    projectsContainer.textContent = '';

    for (const project of projects) {
        projectsContainer.innerHTML += `
        <div class="project">
            <a target="_blank" href="${project.html_url}"><code>${project.full_name}</code></a>
            <br />
            <code>${project.description || 'No description'}</code>
        </div>
        `;
    }
}