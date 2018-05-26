var app = angular.module("MyPerfercWeather", []);

app.controller("myCtrl", function($scope, $http, $window) {
	// Constants for scope
	$scope.TEMPERATURE_CONST = 21;
	$scope.HUMIDIDTY_CONST = 50;
	
	// Variables
	$scope.cities = [];
	
	// Functions and CB
	
	$window.map = new google.maps.Map(document.getElementById('googleMap'), {
        center: {
            lat: 32.0717321,
            lng: 34.7869408
        },
        zoom: 10
    });
	
	$scope.updateResults = function() {
		$scope.lng = $window.map.getCenter().lng();
		$scope.lat = $window.map.getCenter().lat();
		$scope.getDataFromOWDB($scope.lat,$scope.lng)
	}
	
	$window.map.addListener('center_changed', function() {
		window.setTimeout($scope.updateResults, 500);
    });
	
	$scope.getDataFromOWDB = function (lat,lon) {
		API_URL_CONST = "https://api.openweathermap.org/data/2.5/find?units=metric";
		API_ID_KEY = "d030420a7eb8a7a56c796265c22204db";
		
		
		$http.get(API_URL_CONST + "&lat=" +lat + "&lon=" + lon + "&cnt=20&appid=" + API_ID_KEY)
			.then(function successCallback(response) {
					$scope.cities = response.data.list;
					$scope.transformDatainDB();
				}, function errorCallback(response){
					$scope.cities = [{"name" : response.data.message}]; // should rethink later?
				}
			);
	}
	
	$scope.transformDatainDB = function () {
		if ($scope.cities.length)
		{
			for (var x = 0; x < $scope.cities.length; x++)
			{
				$scope.calculateBestWeatherFeel($scope.cities[x]);
				$scope.calculateBestWeatherDist($scope.cities[x]);
			}
		}
	}
	
	$scope.calculateBestWeatherFeel = function(object)
	{
		object.feel = (object.main.temp +
			(object.main.humidity - $scope.HUMIDIDTY_CONST)/10).toFixed(2);
	}
	
	$scope.calculateBestWeatherDist = function(object)
	{
		object.dist = Math.abs(object.feel - $scope.TEMPERATURE_CONST);
	}
	$scope.updateResults();
});

