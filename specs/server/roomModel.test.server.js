'use strict';

var expect = require('expect.js');
var path = require('path');

var Rooms = require(path.resolve('./server/room/roomModel.js'));

describe('Room Model', function () {

  var room, room2;

  it('should have a rooms object', function () {
    expect(Rooms.rooms).to.be.a('object');
  });

  it('should have a creaetOrGetRoom function', function () {
    expect(Rooms.createOrGetRoom).to.be.a('function');
  });

  it('should have an updateRooms function', function () {
    expect(Rooms.updateRooms).to.be.a('function');
  });

  it('should have a removeRoom function', function () {
    expect(Rooms.removeRoom).to.be.a('function');
  });

  it('should start with an empty rooms storage', function () {
    expect(Object.keys(Rooms.rooms.storage).length).to.equal(0);
    expect(Rooms.rooms.roomCount).to.equal(0);
  });

  it('should create a room without an error', function () {
    room = Rooms.createOrGetRoom('someroomhash');
    expect(room).to.be.ok();
  });

  it('should have a users array', function () {
    expect(Array.isArray(room.users)).to.equal(true);
  });

  it('should have a count of the members', function () {
    expect(room.members).to.be.a('number');
  });

  it('should default to 1 members', function () {
    expect(room.members).to.equal(1);
  });

  xit('should have the an equal number of members and users', function () {
    expect(room.users.length).to.equal(room.members);
  });

  it('should have a max Occupancy', function () {
    expect(room.maxOccupancy).to.be.a('number');
  });

  it('should default to a maxOccupancy of 2', function () {
    expect(room.maxOccupancy).to.equal(2);
  });

  it('should return the same room', function () {
    expect(Rooms.createOrGetRoom('someroomhash')).to.equal(room);
  });

  it('should only have one room', function () {
    expect(Object.keys(Rooms.rooms.storage).length).to.equal(1);
    expect(Rooms.rooms.roomCount).to.equal(1);
  });

  it('shoud remove a room', function () {
    Rooms.removeRoom('someroomhash');
    expect(Object.keys(Rooms.rooms.storage).length).to.equal(0);
    expect(Rooms.rooms.roomCount).to.equal(0);
  });

  it('should be able to add multiple rooms', function () {
    room = Rooms.createOrGetRoom('someroomhash');
    expect(room).to.be.ok();

    room2 = Rooms.createOrGetRoom('someroomhash2');
    expect(room).to.be.ok();
  });

  it('should have 2 rooms in storage', function () {
    expect(Object.keys(Rooms.rooms.storage).length).to.equal(2);
    expect(Rooms.rooms.roomCount).to.equal(2);
  });

  it('should have 2 different rooms', function () {
    expect(Rooms.rooms.storage[room.id]).to.not.equal(Rooms.rooms.storage[room2.id]);
  });

  it('should return the appropriate rooms', function () {
    expect(Rooms.createOrGetRoom(room.id)).to.equal(room);
    expect(Rooms.createOrGetRoom(room2.id)).to.equal(room2);
  });

  it('should be able to update a room', function () {
    room.maxOccupancy = 3;
    Rooms.updateRooms(room);
    expect(Rooms.createOrGetRoom(room.id).maxOccupancy).to.equal(3);
  });

});
