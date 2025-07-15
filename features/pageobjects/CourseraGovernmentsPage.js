class CourseraGovernmentsPage {
  get navBar() { return $('[data-testid="navbar-governments"]'); }
  get heroHeading() { return $('h1=Equip citizens and government employees with in-demand skills'); }
  get contactSalesButton() { return $('button=Contact Sales'); }
  get chooseCareerSolutionsHeading() { return $('h1=Choose the right career solutions for your citizens and employees'); }
  get carSolnCards() { return $$('div.CarSoln'); }
  get blueBanner() { return $('h2=Grow your talent and economy with the world’s leading skills platform'); }
  get bannerHeading() { return $('h1=Transform your workforce today'); }
  get achievements() { return $$('div.flex.items-stretch.justify-center .AchievementCard'); }
  get footer() { return $('[data-testid="footer"]'); }
}

export default new CourseraGovernmentsPage();
