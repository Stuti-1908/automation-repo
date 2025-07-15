class CourseraUniversitiesPage {
  get navBar() { return $('[data-testid="navbar-universities"]'); }
  get heroHeading() { return $('h1=Strengthen employability to attract more students'); }
  get contactSalesButton() { return $('button=Contact Sales'); }
  get offerStudentsHeading() { return $('h1*=Offer students'); }
  get careerAcademySection() { return $('h1=CAREER ACADEMY'); }
  get professionalCertificatesSection() { return $('h1=PROFESSIONAL CERTIFICATES'); }
  get blueBanner() { return $('h2=Expand your curriculum and empower your faculty'); }
  get bannerHeading() { return $('h1=Help prepare career-ready graduates'); }
  get achievements() { return $$('div.flex.items-stretch.justify-center .AchievementCard'); }
  get footer() { return $('[data-testid="footer"]'); }
}

export default new CourseraUniversitiesPage();
