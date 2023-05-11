import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';

const schoolAPI = 'https://www.bhhs.com/bin/bhhs/cregSchoolServlet?latitude=42.56574249267578&longitude=-70.76632690429688';

async function getSchools() {
  var publicSchools = [];
  var privateSchools = [];
  const resp = await fetch(schoolAPI);
  if (resp.ok) {
    const schoolData = await resp.json();
    publicSchools = schoolData.schoolResults.public;
    privateSchools = schoolData.schoolResults.private;
  }
  return {
    public: publicSchools,
    private: privateSchools
  }
}

async function showSchoolDetail() {
  var schoolTable = document.querySelector('.schools-table');
  schoolTable.style.display = 'none';
  const schoolData = await getSchools();
  const schools = [...schoolData.public, ...schoolData.private];
  console.log(schools);
  var schoolN = this.innerText || this.textContent;
  schoolN = String(schoolN).trim();
  console.log(schoolN);
  var school = schools.find((s) => s.schoolName == schoolN);
  console.log(school);
  var schoolDetail = document.querySelector('.cmp-local-school-detail');
  schoolDetail.innerHTML = createSchoolDetailHTML(school);
}

function createSchoolDetailHTML(school) {
  var districtName = school.district.districtName ? school.district.districtName : "n/a";
  return `
    <div class="property-container">
      <div class="property-row">
        <div class="col col-12 col-md-10 offset-md-1">
          <h5 class="cmp-local-school-detail__title">${school.schoolName}</h5>
          <div class="cmp-local-school-detail__profile">
            <div class="property-row">
              <div class="col col-12 col-xl-6">
                <div class="property-row">
                  <div class="col col-4">
                    <h6>Grades</h6>
                    <p>${school.lowGrade}-${school.highGrade}</p>
                  </div>
                  <div class="col col-4">
                    <h6>Students</h6>
                    <p>${school.schoolYearlyDetails[0].numberOfStudents}</p>
                  </div>
                  <div class="col col-4">
                    <h6>Type</h6>
                    <p>${school.schoolLevel}</p>
                  </div>
                </div>
                <h6>District</h6>
                <p>${districtName}</p>
                <h6>Contact</h6>
                <p class="adr">${school.addressFull}</p>
                <p class="tel">${school.phone}</p>
                <p class="url">
                  <a target="_blank" href="${school.url}">${school.url}</a>
                </p>
              </div>
              <div class="col col-12 col-xl-6 cmp-local-school-detail__boundary has-boundary">
                <div class="cmp-local-school-detail__map">
                  <div id="school_gmap_canvas" style="position: relative; overflow: hidden;"></div>
                  <div class="custom-controls">
                    <div class="zoom-controls">
                      <a class="map-zoom-in"></a> 
                      <a class="map-zoom-out"></a>
                    </div>
                  </div>
                </div>
                <div class="cmp-local-school-detail__more">
                  <a href="#">
                    <span class="icon icon-search"></span>
                    See homes this school serves
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="cmp-local-school-detail__stats">
              <div class="property-row">
                <div class="col col-6">
                  <h6>
                    Students per Teacher
                  </h6>
                  <div class="cmp-local-school-detail__stat">
                    <div class="val">
                      ${school.schoolYearlyDetails[0].pupilTeacherRatio}
                    </div>
                    <!---->
                  </div>
                </div>
                <!---->
              </div>
            </div>
            <!---->
            <div class="cmp-local-school-detail__ratings">
              <h6>School Ratings</h6>
              <p>For school ratings and more information, please visit SchoolDigger.</p> 
              <a target="_blank" href="${school.urlCompare}" class="btn btn-secondary--compact">
                <span class="cmp-cta__btn-text">See Ratings</span>
              </a>
            </div>
            <div class="close" onclick="getElementById('school-detail').innerHTML='';getElementById('school-table').style.display='block';">
              <span class="icon icon-close_x">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="close-x" role="img" aria-hidden="true" tabindex="-1">
                  <use xlink:href="/icons/icons.svg#close-x" role="presentation" aria-hidden="true" tabindex="-1"></use>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

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
  const schoolData = await getSchools();
  var publicSchools = schoolData.public;
  var privateSchools = schoolData.private;
  var schoolsHTML = `
    <div class="schools-wrap">
      <div id="school-table" class="schools-table">
  `;
  if (publicSchools.length != 0) {
    schoolsHTML += createSchoolTableHTML('Public', publicSchools);
  }
  if (privateSchools.length != 0) {
    schoolsHTML += createSchoolTableHTML('Private', privateSchools);
  }
  schoolsHTML += `
      </div>
      <div id="school-detail" class="cmp-local-school-detail">
      </div>
    </div>
  `;
  var schoolAccordionItem = createAccordionItem('schools', 'Your Schools', schoolsHTML, schoolData.citation);
  block.append(schoolAccordionItem);
  decorateIcons(block);
  loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
  loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
  
  
  var schoolNames = block.querySelectorAll('.school-name');
  schoolNames.forEach((school) => {
    school.addEventListener('click', showSchoolDetail);
  });
  
  /*
  var schoolDetail = block.querySelector('.cmp-local-school-detail');
  var school = privateSchools[2];
  schoolDetail.innerHTML = createSchoolDetailHTML(school);
  */
}