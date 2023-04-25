import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';

const schoolAPI = 'https://www.bhhs.com/bin/bhhs/cregSchoolServlet?latitude=42.56574249267578&longitude=-70.76632690429688';

function createSchoolTableHTML(type, schools) {
  var schoolHTML = `
    <div class="property-container">
  `;
  schools.forEach((school) => {
    schoolHTML += `
      <div class="property-row">
        <div class="col col-12 col-lg-2 offset-md-1 col-md-10 schools-col-1">
          <div class="schools-cell">
            <div class="schools-type">${type}</div>
          </div>
        </div>
        <div class="col col-9 col-xl-5 offset-lg-0 col-lg-4 offset-md-1 col-md-8 schools-col-2">
          <div class="schools-cell">
            <span class="school-name">
              ${school.schoolName}
            </span>
            <span class="school-grades">
              ${school.lowGrade}-${school.highGrade}
            </span>
          </div>
        </div>
        <div class="col d-none d-lg-block col-lg-2 schools-col-3">
          <div class="schools-cell">
            <div class="school-qty">
              ${school.schoolYearlyDetails[0].numberOfStudents} students
            </div>
          </div>
        </div>
        <div class="col col-3 col-xl-1 col-md-2 schools-col-4">
          <div class="schools-cell">
            <div class="school-dist">
              ${school.distanceStr}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  schoolHTML += `
    </div>
  `;
  return schoolHTML;
}

export default async function decorate(block) {
  const resp = await fetch(schoolAPI);
  if (resp.ok) {
    const schoolData = await resp.json();
    console.log(schoolData);
    var publicSchools = schoolData.schoolResults.public;
    var privateSchools = schoolData.schoolResults.private;
    var schoolsHTML = `
      <div class="schools-wrap">
        <div class="schools-table active">
    `;
    if (publicSchools.length != 0) {
      schoolsHTML += createSchoolTableHTML('Public', publicSchools);
    }
    if (privateSchools.length != 0) {
      schoolsHTML += createSchoolTableHTML('Private', privateSchools);
    }
    schoolsHTML += `
        </div>
        <div class="schools-detail"></div>
      </div>
    `;
    var schoolAccordionItem = createAccordionItem('schools', 'Your Schools', schoolsHTML, schoolData.citation);
    block.append(schoolAccordionItem);
    decorateIcons(block);
    loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
    loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
  }
}