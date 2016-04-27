kentonchunApp.value('toastr', toastr);

//service to display toastr notifications
kentonchunApp.factory('ToastrNotifierService', function(toastr){
  return {
    notify: function(notification){
      var status, title, message;

      toastr.options={
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      };

      if(notification.status && _.contains(statusCodes, notification.status)){
        //set status and title to the notification's status
        status = notification.status;
        title = _.capitalize(notification.status);

        //loggly
//        _LTracker.push(notification);
      }else{
        status = statusCodes.ERROR;
        title = _.capitalize(statusCodes.ERROR);
        //loggly
//        _LTracker.push({status:"incorrect status", notification: notification});
      }

      if(_.isEmpty(notification.message)){
        message = "An Error Occurred";
      }else{
        message = notification.message;
      }

      toastr[status](message, title);

    }
  };
});