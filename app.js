const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get(`/api/v1/tours`, (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const myTour = tours.find((el) => el.id === id);

  if (!myTour) {
    res.status(404).json({
      status: 'failed',
      message: 'Tour id does not exist',
    });
  } else {
    res.status(200).json({
      status: 'success',
      data: { tour: myTour },
    });
  }
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);

  const id = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(req.body, { id });

  // console.log(newTour);
  tours.push(newTour);
  // console.log(tours);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(200).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
