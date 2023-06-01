import { createAccordionItem } from '../../scripts/accordion.js';
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';

const urlParams = new URLSearchParams(window.location.search);
export const DOMAIN = urlParams.get('env') === 'stage' ? 'ignite-staging.bhhs.com' : 'www.bhhs.com';
const API_URL = `https://${DOMAIN}/bin/bhhs`;

async function getSchools(latitude, longitude) {
  const resp = await fetch(`${API_URL}/cregSchoolServlet?latitude=${latitude}&longitude=${longitude}`);
  if (resp.ok) {
    const data = await resp.json();
    /* eslint-disable-next-line no-underscore-dangle */
    return data;
  }
  /* eslint-disable-next-line no-console */
  console.log('Unable to retrieve schools.');
  return undefined;
}

function createSchoolTableHTML(type, schools) {
  let schoolHTML = `
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
  const latitude = urlParams.get('latitude') || window.property.Latitude;
  const longitude = urlParams.get('longitude') || window.property.Longitude;
  if (latitude && longitude) {
    const schools = await getSchools(latitude, longitude);
    if (schools) {
      const publicSchools = schools.schoolResults.public || [];
      const privateSchools = schools.schoolResults.private || [];
      let schoolsHTML = `
        <div class="schools-wrap">
          <div id="school-table" class="schools-table">
      `;
      if (publicSchools.length !== 0) {
        schoolsHTML += createSchoolTableHTML('Public', publicSchools);
      }
      if (privateSchools.length !== 0) {
        schoolsHTML += createSchoolTableHTML('Private', privateSchools);
      }
      schoolsHTML += `
          </div>
          <div id="school-detail" class="cmp-local-school-detail d-none">
            <div class="property-container">
              <div class="property-row">
                <div class="col col-12 col-md-10 offset-md-1">
                  <h5 class="cmp-local-school-detail__title"></h5>
                  <div class="cmp-local-school-detail__profile">
                    <div class="property-row">
                      <div class="col col-12 col-xl-6">
                        <div class="property-row">
                          <div class="col col-4">
                            <h6>Grades</h6>
                            <p class="cmp-local-school-detail__grade-range"></p>
                          </div>
                          <div class="col col-4">
                            <h6>Students</h6>
                            <p class="cmp-local-school-detail__num-students"></p>
                          </div>
                          <div class="col col-4">
                            <h6>Type</h6>
                            <p class="cmp-local-school-detail__school-type"></p>
                          </div>
                        </div>
                        <h6>District</h6>
                        <p class="cmp-local-school-detail__district-name"></p>
                        <h6>Contact</h6>
                        <p class="adr"></p>
                        <p class="tel"></p>
                        <p class="url">
                          <a target="_blank" href=""></a>
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
                      <a target="_blank" class="btn btn-secondary--compact">
                        <span class="cmp-cta__btn-text">See Ratings</span>
                      </a>
                    </div>
                    <div class="close" onclick="getElementById('school-table').classList.toggle('d-none');getElementById('school-detail').classList.toggle('d-none');">
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
          </div>
        </div>
      `;
      const schoolAccordionItem = createAccordionItem('schools', 'Your Schools', schoolsHTML, schools.citation);
      block.append(schoolAccordionItem);
      decorateIcons(block);
      loadCSS(`${window.hlx.codeBasePath}/styles/accordion.css`);
      loadCSS(`${window.hlx.codeBasePath}/styles/property-details.css`);
      const schoolNames = block.querySelectorAll('.school-name');
      schoolNames.forEach((school) => {
        school.addEventListener('click', (e) => {
          const schoolTable = document.getElementById('school-table');
          schoolTable.classList.toggle('d-none');
          const schoolDetail = document.getElementById('school-detail');
          schoolDetail.classList.toggle('d-none');
          const target = e.currentTarget;
          const schoolName = target.textContent.trim();
          const schoolBody = [
            ...privateSchools,
            ...publicSchools].find((s) => s.schoolName === schoolName);
          schoolDetail.querySelector('.cmp-local-school-detail__title').textContent = schoolBody.schoolName;
          schoolDetail.querySelector('.cmp-local-school-detail__grade-range').textContent = `${schoolBody.lowGrade}-${schoolBody.highGrade}`;
          schoolDetail.querySelector('.cmp-local-school-detail__num-students').textContent = schoolBody.schoolYearlyDetails[0].numberOfStudents;
          schoolDetail.querySelector('.cmp-local-school-detail__school-type').textContent = schoolBody.schoolLevel;
          schoolDetail.querySelector('.cmp-local-school-detail__district-name').textContent = schoolBody.district.districtName ? schoolBody.district.districtName : 'n/a';
          schoolDetail.querySelector('.adr').textContent = schoolBody.addressFull;
          schoolDetail.querySelector('.tel').textContent = schoolBody.phone;
          schoolDetail.querySelector('.url > a').textContent = schoolBody.url;
          schoolDetail.querySelector('.url > a').setAttribute('href', schoolBody.url);
          schoolDetail.querySelector('.cmp-local-school-detail__stat .val').textContent = schoolBody.schoolYearlyDetails[0].pupilTeacherRatio;
          schoolDetail.querySelector('.cmp-local-school-detail__ratings a').setAttribute('href', schoolBody.urlCompare);
        });
      });
    }
  }
}
