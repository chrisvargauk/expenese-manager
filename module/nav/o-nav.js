/**
 * Created with JetBrains WebStorm.
 * User: krisztianvarga
 * Date: 09/05/2014
 * Time: 12:52
 * To change this template use File | Settings | File Templates.
 */

define([
    'module/nav/v-nav',
    'module/nav/m-nav'
  ], function (
    VNav,
    MNav
  ) {

  ONav = function () {
    if ( ONav.prototype._singletonInstance ) {
      return ONav.prototype._singletonInstance;
    }
    ONav.prototype._singletonInstance = this;

    this.model = new MNav();

    this.view = new VNav({
      model: this.model
    });
  }

  return new ONav();
});