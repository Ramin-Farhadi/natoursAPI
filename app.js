const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Route handlers
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestat: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
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
      requestTime: req.requestTime,
      data: { tour: myTour },
    });
  }
};

const postTours = (req, res) => {
  console.log(req.body);

  const id = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(req.body, { id });

  tours.push(newTour);

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
};

const patchTour = (req, res) => {
  console.log(req.body);
  const id = req.params.id * 1;
  const targetTour = tours.find((el) => el.id === id);

  if (!targetTour) {
    res.status(404).json({
      status: 'failed',
      message: 'Id does not exist',
    });
  } else {
    const patchedTour = req.body;
    // console.log(Object.keys(patchedTour));
    Object.keys(patchedTour).forEach((item) => {
      targetTour[item] = patchedTour[item];
    });

    // console.log(targetTour);
    fs.writeFile(
      `${__dirname}/dev-data/data/tours-simple.json`,
      JSON.stringify(tours),
      (err) => {
        res.status(200).json({
          status: 'Patch was successful',
          data: {
            tour: targetTour,
          },
        });
      }
    );
  }
};

const getUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const postUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const patchUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
// 3)Routes

app.route(`/api/v1/tours`).get(getTours).post(postTours);
app.route(`/api/v1/tours/:id`).get(getTour).patch(patchTour);

app.route(`/api/v1/users`).get(getUsers).post(postUsers);

app.route(`/api/v1/users/:id`).get(getUser).patch(patchUser).delete(deleteUser);

// app.get(`/api/v1/tours`, getTours);
// app.post('/api/v1/tours', postTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', patchTour);

// 4) Start Server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
