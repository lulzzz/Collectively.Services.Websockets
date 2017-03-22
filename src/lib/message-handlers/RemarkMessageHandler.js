//RemarkMessageHandler.js
var ServiceClient = require('../ServiceClient.js');

module.exports = function(io, configuration) {
  this.io = io;
  let serviceConfiguration = configuration.find((x) => x.title === 'remarks-service');
  this.serviceClient = new ServiceClient(serviceConfiguration);

  this.publishRemarkCreated = async (event) => {
    console.log('Received RemarkCreated event');
    let remark = await fetchRemark(event.resource);
    if (!remark) {
      return;
    }

    let message = {
      id: remark.id,
      author: remark.author.name,
      category: remark.category.name,
      location: remark.location,
      description: remark.description,
      createdAt: remark.createdAt,
      resolved: remark.resolved
    };
    console.log('Publishing remark_created message');
    await this.io.sockets.emit('remark_created', message);
  };

  this.publishRemarkResolved = async (event) => {
    console.log('Received RemarkResolved event');
    let remark = await fetchRemark(event.resource);
    if (!remark) {
      return;
    }
    let message = {
      remarkId: remark.id,
      resolverId: remark.state.user.userId,
      resolver: remark.state.user.name,
      resolvedAt: remark.state.createdAt
    };
    console.log('Publishing remark_resolved message');
    await this.io.sockets.emit('remark_resolved', message);
  };

  this.publishRemarkDeleted = async (event) => {
    console.log('Received RemarkDeleted event');
    let message = {
      remarkId: event.id
    };
    console.log('Publishing remark_deleted message');
    await this.io.sockets.emit('remark_deleted', message);
  }

  this.publishPhotosToRemarkAdded = async (event) => {
  console.log('Received PhotosToRemarkAdded event');
    let remark = await fetchRemark(event.resource);
    if (!remark) {
      return;
    }

    let photoIds = remark.photos
      .map((x) => x.groupId)
      .filter((x, i, a) => a.indexOf(x) == i);
    let photosCount = photoIds.length;
    let newPhotos = remark.photos
      .slice(Math.max(remark.photos.length - 3, 0));

    let message = {
      remarkId: remark.id,
      photosCount: photosCount,
      newPhotos: newPhotos
    };
    console.log('Publishing photos_to_remark_added message');
    await this.io.sockets.emit('photos_to_remark_added', message);
  };

  let fetchRemark = async (resource) => {
    let remark = await this.serviceClient.getAsync(resource.service, resource.endpoint);
    if (!remark) {
      console.error(`Cannot fetch remark from ${resource.service}/${resource.endpoint}`);
      return;
    }
    return remark;
  }
}