var app=angular.module("cartApp",[]);
app.controller('cartCtrl', function($scope, $http, $window){
    // Q1) add two more pizza objects 
    $http({
  method: 'GET',
  url: '/menu'
}).then(function successCallback(response) {
    $scope.pizzas=response.data
  }, function errorCallback(response) {
    $scope.pizzas=[]
  });
    // add two variables: cart, and total for web page cart.html
 	$scope.cart=JSON.parse(localStorage.getItem("cart"))
    if ($scope.cart==null) {
        $scope.cart=[]
        $scope.total=0.0
        $scope.numItems=0
    }
    else {
    $scope.numItems=$scope.cart.reduce((total, item) => total + item.quantity,0)
}
//Q2: addToCart() function
    $scope.addToCart=function(item) {
     let index=$scope.cart.findIndex(x=>x.pizzaName==item.pizzaName)
    if(index==-1)//-1 means item is not in the cart
    {
        item.quantity=1
        //item has 4 properties: name, price, image, and quantity
        $scope.cart.push(item)
    }
    else
        $scope.cart[index].quantity+=1

    $scope.numItems+=1
    localStorage.setItem("cart", JSON.stringify($scope.cart))
    //store cart locally, so every wweb page can access it locally
}

//Q3: removeFromCart() function
$scope.removeFromCart=function(item) {
    let index=$scope.cart.findIndex(x=>x.name==item.name)
        $scope.cart[index].quantity-=1
        $scope.cart.splice(item, 1) 
        $scope.numItems-=1
        localStorage.setItem("cart", JSON.stringify($scope.cart))
        $scope.calcTotalPrice()
}


//Q4: clearCart() function
$scope.clearCart=function() {
    $scope.cart.splice(0, $scope.numItems)
    $scope.numItems=0
    localStorage.clear()
    localStorage.setItem("cart".JSON.stringify($scope.cart))
}

//Q5: calcTotalPrice() function
$scope.calcTotalPrice=function() {
    //var total = 0;
    for(var i = 0; i < $scope.numItems; i++){
        //var product = $scope.cart[i];
        $scope.total += (item.price * item.quantity);
    }
  //  var total=0.0
 //   for (i=0;i<$scope.numItems;i++)
  //      $scope.total+=$scope.cart[i].price
    //localStorage.setItem("cart".JSON.stringify($scope.cart))
}
//checkout function: redirect to checkout.html  
$scope.checkout=function() {
    $window.location.href = "checkout.html"
}

//placeOrder: send cart, phone and email to the server. 
$scope.placeOrder=function() {
    var checkoutData = []
    checkoutData.push($scope.cart)
    var custom = [{customID:$scope.phone}, {email:$scope.email}]
    checkoutData.push(custom)

    $http({
        method: 'POST',
        url: '/placeOrder'
        data: checkoutData,
    }).then(function successCallback(response) {
        $scope.msg = "Your order has been recieved!"
        $scope.clearCart()
    }, function errorCallback (response) {
        $scope.msg = "Error. Try again."
    });
}
})