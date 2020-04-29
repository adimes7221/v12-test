var mongoose    = require("mongoose");
var Player      = require("./models/players");
var Comment     = require("./models/comments");

var data = [
    { 
        name: "Tim Tebow", 
        image: "https://img.bleacherreport.net/img/images/photos/001/769/923/95632033_crop_north.jpg?h=533&w=800&q=70&crop_x=center&crop_y=top",
        description: "Donec iaculis, nisi et fringilla feugiat, urna magna consectetur sem, tristique fringilla dui mauris ut nibh. Suspendisse potenti. Vivamus magna risus, sollicitudin eu convallis mollis, bibendum ut nisl. Quisque eget arcu sit amet dolor volutpat egestas. Proin a massa ac nunc tincidunt facilisis ut in massa. Maecenas vel odio eu felis maximus faucibus ut vel nisi. Phasellus quis nisl rhoncus, euismod ipsum a, auctor erat."
    },
    {
        name: "Percy Harvin", 
        image: "https://www.saturdaydownsouth.com/wp-content/uploads/2015/02/percy-harvin-florida.jpg", 
        description: "Nunc sagittis nunc et sem pharetra commodo. Sed metus lacus, mattis quis gravida quis, tristique ut enim. Donec faucibus vehicula dolor at sagittis. Sed hendrerit et ipsum id feugiat. Maecenas eleifend sit amet urna sit amet feugiat. Sed a vehicula magna. Etiam ultrices maximus faucibus. Cras porttitor diam ut nisi porttitor gravida vel tincidunt libero. Nunc tempor pretium est, gravida tincidunt libero aliquet eget."
    },
    {
        name: "Brandon Spikes", 
        image: "https://www2.pictures.zimbio.com/gi/Florida+International+v+Florida+7RdTgG6uvbpx.jpg",
        description: "Nunc sagittis nunc et sem pharetra commodo. Sed metus lacus, mattis quis gravida quis, tristique ut enim. Donec faucibus vehicula dolor at sagittis. Sed hendrerit et ipsum id feugiat. Maecenas eleifend sit amet urna sit amet feugiat. Sed a vehicula magna. Etiam ultrices maximus faucibus. Cras porttitor diam ut nisi porttitor gravida vel tincidunt libero. Nunc tempor pretium est, gravida tincidunt libero aliquet eget."    
    }
];

function seedDB(){
   //Remove all players
   Player.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed players!");
        Comment.deleteMany({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed comments");
        });
    //add a few campgrounds
        data.forEach(function(seed){
            Player.create(seed, function(err, player){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a player");
                    //create a comment
                        Comment.create(
                            {
                                text: "This player is great, but I need a natty",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    player.comments.push(comment);
                                    player.save();
                                    console.log("Created new comment");
                                }
                            }
                        );
                    }   
                }
            );
        });
    });
}
 
module.exports = seedDB;