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

  return new VNav({
    model: new MNav()
  });
});