(function() {
  "use strict";
  var $root = $("#root");

  var boardData = {
    figures: [
      ["br", "bkn", "bb", "bq", "bk", "bb", "bkn", "br"],
      ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
      ["wr", "wkn", "wb", "wq", "wk", "wb", "wkn", "wr"]
    ],
    verticalCaptions: [8, 7, 6, 5, 4, 3, 2, 1],
    horizontalCaptions: ["a", "b", "c", "d", "e", "f", "g", "h"],
    cellSize: 30
  };

  var mapFiguresNameToClassName = {
    wk: "figure--white-king",
    wq: "figure--white-queen",
    wr: "figure--white-rook",
    wb: "figure--white-bishop",
    wkn: "figure--white-knight",
    wp: "figure--white-pawn",
    bk: "figure--black-king",
    bq: "figure--black-queen",
    br: "figure--black-rook",
    bb: "figure--black-bishop",
    bkn: "figure--black-knight",
    bp: "figure--black-pawn"
  };

  var getPositionInBoard = function(size, rowIdx, columnIdx) {
    return {
      left: size * columnIdx,
      top: size * rowIdx
    };
  };

  var setElementsInLineHorizontal = function(
    elements,
    size,
    startLeft,
    startTop
  ) {
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
      elements[i].css({
        top: startTop,
        left: startLeft + i * size
      });
    }
  };

  var setElementsInLineVertical = function(
    elements,
    size,
    startLeft,
    startTop
  ) {
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
      elements[i].css({
        top: startTop + i * size,
        left: startLeft
      });
    }
  };

  var cellSize = boardData.cellSize;
  var rows = boardData.figures.length;
  var columns = boardData.figures[0].length;

  // draw borad
  var boardWidth = cellSize * rows;
  var boardHeight = cellSize * columns;

  var $board = $
    .div("board")
    .appendTo($root)
    .css({ width: boardWidth, height: boardHeight });

  var createCaptions = function(opt) {
    var parent = opt.parent;
    var classes = opt.classes;
    var texts = opt.texts;
    var inLineFunc = opt.inLineFunc;
    var size = opt.size;
    var startLeft = opt.startLeft;
    var startTop = opt.startTop;
    var elements = [];
    for (var i = 0, len = texts.length; i < len; i++) {
      var $caption = $
        .div(classes)
        .text(texts[i])
        .appendTo(parent)
        .css({ width: size, height: size, lineHeight: size + "px" });
      elements.push($caption);
    }
    inLineFunc(elements, size, startLeft, startTop);
  };

  var horizontalCaptions = boardData.horizontalCaptions;
  var verticalCaptions = boardData.verticalCaptions;
  createCaptions({
    parent: $board,
    classes: "caption caption--side_left",
    texts: verticalCaptions,
    inLineFunc: setElementsInLineVertical,
    size: cellSize,
    startLeft: -cellSize,
    startTop: 0
  });
  createCaptions({
    parent: $board,
    classes: "caption caption--side_right",
    texts: verticalCaptions,
    inLineFunc: setElementsInLineVertical,
    size: cellSize,
    startLeft: boardWidth,
    startTop: 0
  });
  createCaptions({
    parent: $board,
    classes: "caption caption--side_top",
    texts: horizontalCaptions,
    inLineFunc: setElementsInLineHorizontal,
    size: cellSize,
    startLeft: 0,
    startTop: -cellSize
  });
  createCaptions({
    parent: $board,
    classes: "caption caption--side_bottom",
    texts: horizontalCaptions,
    inLineFunc: setElementsInLineHorizontal,
    size: cellSize,
    startLeft: 0,
    startTop: boardWidth
  });

  // draw cells
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      var cellColor = (i + j) % 2 === 0 ? "cell--light" : "cell--dark";
      var $cell = $
        .div("cell " + cellColor)
        .css({
          width: cellSize,
          height: cellSize,
          left: j * cellSize,
          top: i * cellSize
        })
        .appendTo($board);
    }
  }

  // draw figures
  var createFigure = function(figureName, size) {
    return $.div("figure " + mapFiguresNameToClassName[figureName]).css({
      width: size,
      height: size,
      lineHeight: size + "px",
      fontSize: size
    });
  };

  var whiteFigures = [];
  var blackFigures = [];

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      var figureName = boardData.figures[i][j];
      if (figureName !== null) {
        var figurePositionInBoard = getPositionInBoard(cellSize, i, j);
        var $figure = createFigure(figureName, cellSize)
          .appendTo($board)
          .data("boardPoition", figurePositionInBoard)
          .data("onBoard", false);
        if (figureName[0] === "w") {
          whiteFigures.push($figure);
        } else {
          blackFigures.push($figure);
        }
      }
    }
  }

  var horizontalGap = cellSize;
  setElementsInLineHorizontal(
    whiteFigures,
    cellSize,
    0,
    boardHeight + horizontalGap
  );
  setElementsInLineHorizontal(
    blackFigures,
    cellSize,
    0,
    -horizontalGap - cellSize
  );

  // click handler
  $(document).on("click", ".figure", function() {
    var $figure = $(this);
    if ($figure.data("onBoard")) {
      return;
    }
    $figure
      .data("onBoard", true)
      .animate($figure.data("boardPoition"), 400, "linear");
  });
})();
