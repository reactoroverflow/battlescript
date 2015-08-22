'use strict';

describe('AttachTokens Factory', function () {
  var AttachTokens;
  
  beforeEach(module('battlescript'));

  beforeEach(inject(function ($injector){
    AttachTokens = $injector.get('AttachTokens');
  }));

  it('should have an AttachTokens Factory', function () {
    expect(AttachTokens).to.be.ok();
  });

});
