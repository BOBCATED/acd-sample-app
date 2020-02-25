const ObjectId = require('mongodb').ObjectId;
      
module.exports = function(conn, router){
    const mongodbName = process.env.MONGODB_DB_NAME

    router.post('/newQuiz', function(req, res, next){
        console.log(req.body);
        var newPopQuizForm = req.body;
    
        var newPopQuiz = {
            question: newPopQuizForm.question,
            answers: [],
            correctAnswer: newPopQuizForm.correctAnswer
        }
    
        newPopQuiz.answers.push({selection: 'a', value: newPopQuizForm.answer1});
        newPopQuiz.answers.push({selection: 'b', value: newPopQuizForm.answer2});
        newPopQuiz.answers.push({selection: 'c', value: newPopQuizForm.answer3});
        newPopQuiz.answers.push({selection: 'd', value: newPopQuizForm.answer4});
        
        conn.mongodb.db(mongodbName).collection('quiz').insertOne(newPopQuiz,function(err, result){
            console.log(result);
            res.redirect('/api/list-quizes');
        });
    });
    
    router.post('/updateQuiz', (req, res, next)=>{
        var _answers = [];
        var id = req.body.id;
        console.log("Update Quiz");
        console.log("id > " + id);
        var oid = new ObjectId(id);
        _answers.push({selection: 'a', value: req.body.answer1});
        _answers.push({selection: 'b', value: req.body.answer2});
        _answers.push({selection: 'c', value: req.body.answer3});
        _answers.push({selection: 'd', value: req.body.answer4});
        console.log("req.body.question > " + req.body.question);
        console.log("req.body._answers > " + _answers);
    
        conn.mongodb.db(mongodbName).collection('quiz').updateOne({_id: oid},{$set: {
            question: req.body.question,
            answers: _answers,
            correctAnswer: req.body.correctAnswer
        } }, (err, result)=>{
            res.redirect('/api/list-quizes');
        });
    });
    
    router.post('/deleteQuiz', (req, res, next)=>{
        var id = req.body.id;
        console.log("delete Quiz");
        console.log("id > " + id);
        var oid = new ObjectId(id);
        conn.mongodb.db(mongodbName).collection('quiz').deleteOne({_id: oid}, (err, result)=>{
            res.redirect('/api/list-quizes');
        });
    });
    
    router.get('/quiz/:id', (req,res, next)=>{
        let _id = req.params.id;
        console.log("_id" + _id);
        let oid = new ObjectId(_id)
        conn.mongodb.db(mongodbName).collection('quiz').findOne({_id: oid},(err, result)=>{
            console.log(JSON.stringify(result));
            let editQuiz = {
                id: _id,
                question: result.question,
                answer1: result.answers[0].value,
                answer2: result.answers[1].value,
                answer3: result.answers[2].value,
                answer4: result.answers[3].value,
                correctAnswer: result.correctAnswer
            }
    
            res.render('editQuiz' ,{editQuiz: editQuiz});
        });
    });
    
    router.get('/try-quizes', (req,res, next)=>{
        
        conn.mongodb.db(mongodbName).collection('quiz').find({}).project({correctAnswer: 0}).toArray(function(err, quizes){
            let randomQuizes = [];
            quizes.forEach(element => {
                randomQuizes.push(element);
            });
            console.log(randomQuizes);
            let randomChoice = getRandomInt(randomQuizes.length);
            console.log("randomChoice >>> " + randomChoice);
            console.log(randomQuizes[randomChoice]._id);
            console.log(randomQuizes[randomChoice].answers[0]);
            var tryOutQuiz = {
                id: randomQuizes[randomChoice]._id,
                question: randomQuizes[randomChoice].question,
                answer1: randomQuizes[randomChoice].answers[0].value,
                answer2: randomQuizes[randomChoice].answers[1].value,
                answer3: randomQuizes[randomChoice].answers[2].value,
                answer4: randomQuizes[randomChoice].answers[3].value,
                correctAnswer: randomQuizes[randomChoice].correctAnswer
            }
            res.render('tryquiz', {tryQuiz: tryOutQuiz});
        });
        
    });
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
        }
    
    router.get('/show-deletequizes/:id', (req,res, next)=>{
        var _id = req.params.id;
        console.log("_id" + _id);
        var oid = new ObjectId(_id)
        conn.mongodb.db(mongodbName).collection('quiz').findOne({_id: oid},(err, result)=>{
            console.log(JSON.stringify(result));
            var deleteQuiz = {
                id: _id,
                question: result.question,
                answer1: result.answers[0].value,
                answer2: result.answers[1].value,
                answer3: result.answers[2].value,
                answer4: result.answers[3].value,
                correctAnswer: result.correctAnswer
            }
    
            res.render('deleteQuiz' ,{deleteQuiz: deleteQuiz});
        });
    });
    
    
    router.get('/show-newQuizform', (req, res,next)=>{
        res.render('newQuiz', {});
    })
    
    router.get('/list-quizes', (req,res,next)=>{
        conn.mongodb.db(mongodbName).collection('quiz').find({}).project({correctAnswer: 0}).toArray(function(err, quizes){
            console.log("from mongodb...");
            console.log(JSON.stringify(quizes));
            console.log(quizes.length);
            res.render('listQuiz', {quizes: quizes, isEmpty:quizes.length <= 0,});
        });
    })
    
    router.get('/quiz', function(req,res,next){
        quizCollection.find({}).project({correctAnswer: 0}).toArray(function(err, quizes){
            console.log("from mongodb...");
            console.log(JSON.stringify(quizes));
            res.json(quizes);
        });
    });
    
    router.post('/check-answer', function(req,res,next){
        console.log("CHECK ANSWER !!!!")
        let incomingQuiz = req.body;
        let isCorrectDesc = "Incorrect";
        let isCorrect = false;
        console.log(incomingQuiz.answer);
        console.log(incomingQuiz._id);
        let oid  = new ObjectId(incomingQuiz.id);
        conn.mongodb.db(mongodbName).collection('quiz').findOne({_id: oid},(err, result)=>{
            console.log(JSON.stringify(result));
            console.log(result.correctAnswer)
            if(result.correctAnswer === incomingQuiz.answer){
                console.log("CORRECT !");
                isCorrectDesc = "Correct";
                isCorrect = true;
            }
            res.render('confirm', {isCorrectDesc: isCorrectDesc, isCorrect: isCorrect});
        });
        
    });
}