//RemarkMessageHandler.js

module.exports = function(io) {
  this.io = io;

  this.publishRemarkCreated = (event) => {
    let message = {
      id: event.remarkId,
      author: event.username,
      category: event.category.name,
      location: {
        address: event.location.address,
        coordinates: [ event.location.longitude, event.location.latitude],
        type: "Point"
      },
      description: event.description,
      createdAt: event.createdAt,
      resolved: false
    }
    console.log('Publishing remark_created message');
    this.io.sockets.emit('remark_created', message);
  };

  this.publishRemarkResolved = (event) => {
    let message = {
      remarkId: event.remarkId,
      resolverId: event.state.userId,
      resolver: event.state.username,
      resolvedAt: event.state.createdAt
    };
    console.log('Publishing remark_resolved message');
    this.io.sockets.emit('remark_resolved', message);
  };

  this.publishRemarDeleted = (event) => {
    let message = {
      remarkId: event.id
    };
    console.log('Publishing remark_deleted message');
    this.io.sockets.emit('remark_deleted', message);
  }

  this.publishPhotosToRemarkAdded = (event) => {
    let photoIds = event.photos.$values
      .map((x) => x.groupId)
      .filter((x, i, a) => a.indexOf(x) == i);
    let photosCount = photoIds.length;
    let newPhotos = event.photos.$values
      .slice(Math.max(event.photos.$values.length - 3, 0));

    let message = {
      remarkId: event.remarkId,
      photosCount: photosCount,
      newPhotos: newPhotos
    };
    console.log('Publishing photos_to_remark_added message');
    this.io.sockets.emit('photos_to_remark_added', message);
  };

  this.publishPhotosFromRemarkRemoved = (event) => {
    let message = {
      remarkId: event.remarkId,
      groupIds: event.groupIds.$values,
      photos: event.photos.$values
    };
    console.log('Publishing photos_from_remark_removed message');
    this.io.sockets.emit('photos_from_remark_removed', message);
  };

  this.publishRemarkVoteSubmitted = (event) => {
    console.log('Publishing remark_vote_submitted message');
    this.io.sockets.emit('remark_vote_submitted', event);
  };

  this.publishRemarkVoteDeleted = (event) => {
    console.log('Publishing remark_vote_deleted message');
    this.io.sockets.emit('remark_vote_deleted', event);
  };
}