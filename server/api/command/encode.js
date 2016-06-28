/**
 * Created by rayfang on 6/27/16.
 */
var kue = require('kue');
var queue = kue.createQueue();
var spawn = require('child_process').spawn;


queue.process('encode', function (job, done){


    console.log('Processing encode');



    // add raw_encode script loop and distribute frames


    var child = spawn('ls',
        ['-al', '/var/log/system.log']);


    child.stdout.on('data',
        function (data) {
            console.log('stdout: ' + data);
        }
    );

    child.stderr.on('data',
        function (data) {
            console.log('stderr: ' + data);
        }
    );


    child.on('exit', function (exitCode) {
        console.log("Child exited with code: " + exitCode);

        if (exitCode === 0){

            console.log("Done encode");
            done(null, 'encode_done');
            
        }

    });

});




queue.on('job enqueue', function(id, type){
    console.log( 'Job %s got queued of type %s', id, type );

}).on('job complete', function(id, result){


    if (result === 'encode_done'){

        kue.Job.get(id, function(err, job){
            if (err) return;

            var db_job = queue.create('update_db', {
                path: job.data.path,
                ituner: job.data.ituner
            });

            db_job.save();

            job.remove(function(err){
                if (err) throw err;
                console.log('removed completed encode job #%d', job.id);
            });
        });
    }

    if (result === 'update_db_done'){

        kue.Job.get(id, function(err, job){
            if (err) return;


            job.remove(function(err){
                if (err) throw err;
                console.log('removed completed db job #%d', job.id);
            });
        });

    }


});