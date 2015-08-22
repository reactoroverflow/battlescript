'use strict';

describe('Routing', function () {
  var $state;
  beforeEach(module('battlescript'));

  beforeEach(inject(function ($injector){
    $state = $injector.get('$state');
  }));

  it('should have a /signin route', function () {
    expect($state.get('signin')).to.be.ok();
  });

  it('', function () {
    expect($state.get('signin').url).to.equal('/signin');
  });

  it('', function () {
    expect($state.get('signin').templateUrl).to.equal('app/auth/signin.html');
  });

  it('', function () {
    expect($state.get('signin').controller).to.equal('AuthController');
  });

  it('should have a /signup route', function () {
    expect($state.get('signup')).to.be.ok();
  });

  it('', function () {
    expect($state.get('signup').url).to.equal('/signup');
  });

  it('', function () {
    expect($state.get('signup').templateUrl).to.equal('app/auth/signup.html');
  });

  it('', function () {
    expect($state.get('signup').controller).to.equal('AuthController');
  });

  it('should have a /logout route', function () {
    expect($state.get('logout')).to.be.ok();
  });

  it('', function () {
    expect($state.get('logout').url).to.equal('/logout');
  });

  it('', function () {
    expect($state.get('logout').templateUrl).to.equal('app/auth/logout.html');
  });

  it('', function () {
    expect($state.get('logout').controller).to.equal('AuthController');
  });

  it('should have a /dashboard route', function () {
    expect($state.get('dashboard')).to.be.ok();
  });

  it('', function () {
    expect($state.get('dashboard').url).to.equal('/dashboard');
  });

  it('', function () {
    expect($state.get('dashboard').templateUrl).to.equal('app/dashboard/dashboard.html');
  });

  it('', function () {
    expect($state.get('dashboard').controller).to.equal('DashboardController');
  });

  it('', function () {
    expect($state.get('dashboard').authenticate).to.equal(true);
  });

  it('should have a /settings route', function () {
    expect($state.get('settings')).to.be.ok();
  });

  it('', function () {
    expect($state.get('settings').url).to.equal('/settings');
  });

  it('', function () {
    expect($state.get('settings').templateUrl).to.equal('app/settings/settings.html');
  });

  it('', function () {
    expect($state.get('settings').controller).to.equal('SettingsController');
  });

  it('', function () {
    expect($state.get('settings').authenticate).to.equal(true);
  });

  it('should have a /battleroom route', function () {
    expect($state.get('battleroom')).to.be.ok();
  });

  it('', function () {
    expect($state.get('battleroom').url).to.equal('/battle/:id');
  });

  it('', function () {
    expect($state.get('battleroom').templateUrl).to.equal('app/battle/battle.html');
  });

  it('', function () {
    expect($state.get('battleroom').controller).to.equal('BattleController');
  });

  it('', function () {
    expect($state.get('battleroom').authenticate).to.equal(true);
  });

});
