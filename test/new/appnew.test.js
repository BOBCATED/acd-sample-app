describe('app', () => {
    beforeEach(async () => {
      await page.goto("http://localhost:3000/")
    })
  
    it('should display a PopQuiz heading', async () => {
      await page.screenshot({path: 'test/screenshots/mainpage.png'});
      await expect(page).toMatch('PopQuiz')
    })

    it('click manage pop quiz ', async () => {
      await expect(page).toClick('a', { text: 'Manage Pop Quizes' })
    })

    it('add a new pop quiz', async () => {
      console.log("add new quiz >")
      await page.goto("http://localhost:3000/api/show-newQuizform")
      await expect(page).toFillForm('form[name="addNewQuiz"]', {
        question: 'What colour is Donald Trump\'s hair\?',
        answer1: 'Gold',
        answer2: 'Silver',
        answer3: 'White',
        answer4: 'Black',
        correctAnswer: 'White'
      })
      await expect(page).toClick('button', { text: 'Submit' });
      console.log("add new quiz >")
    })

    it('should display first record', async () => {
      await page.goto("http://localhost:3000/api/list-quizes")
      await page.screenshot({path: 'test/screenshots/listofquizes.png'});
      await expect(page).toMatch('What colour is Donald Trump\'s hair\?')
    })
   
    it('add a new pop quiz', async () => {
      console.log("add new quiz >")
      await page.goto("http://localhost:3000/api/show-newQuizform")
      await expect(page).toFillForm('form[name="addNewQuiz"]', {
        question: 'What is your name?',
        answer1: 'Kenneth',
        answer2: 'Kelvin',
        answer3: 'Louis',
        answer4: 'Max',
        correctAnswer: 'Kenneth'
      })
      await expect(page).toClick('button', { text: 'Submit' });
      console.log("add new quiz >")
    })

    it('benchmark adding a new pop quiz', async () => {
      var startTime, endTime;
      startTime = new Date();
      await page.goto("http://localhost:3000/api/show-newQuizform")
      await expect(page).toFillForm('form[name="addNewQuiz"]', {
        question: 'Current USA president?',
        answer1: 'Donald Duck',
        answer2: 'Donald Trump',
        answer3: 'Obama Barrack',
        answer4: 'Princess Diana',
        correctAnswer: 'Donald Trump'
      })
      await expect(page).toClick('button', { text: 'Submit' })
      endTime = new Date();
      var timeDiff = endTime - startTime; //in ms
      // strip the ms
      timeDiff /= 1000;
      console.log("ms " + timeDiff);
      // get seconds 
      var seconds = Math.round(timeDiff);
      console.log(seconds + " seconds");
      expect(timeDiff).toBeLessThanOrEqual(1.5);
    })
    
    it('list all pop quizes after adding', async () => {
      await page.goto("http://localhost:3000/api/list-quizes")
      await page.screenshot({path: 'test/screenshots/newquiz.png'});
      await expect(page).toMatch('What is your name')
    })

  
  })
