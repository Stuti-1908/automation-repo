class CourseraBusinessesPage {
  get navBar() { return $('[data-testid="navbar-businesses"]'); }
  get heroHeading() { return $('h1=Make talent your competitive advantage'); }
  get contactSalesButton() { return $('button=Contact Sales'); }
  get searchInput() { return $('input[placeholder="e.g.Data Science"]'); }
  get categoryList() { return $('ul'); }
  get academicsSection() { return $('h4=ACADEMICS'); }
  get browseAcademies() { return $('h3=Browse Coursera Acadezmies'); }
  get bannerHeading() { return $('h1=Let’s talk about making talent your advantage'); }
  get achievements() { return $$('div.flex.items-stretch.justify-center .AchievementCard'); }
  get footer() { return $('[data-testid="footer"]'); }
}

export default new CourseraBusinessesPage();
