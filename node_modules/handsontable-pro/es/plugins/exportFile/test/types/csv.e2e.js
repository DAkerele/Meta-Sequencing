describe('exportFile CSV type', function () {
  var id = 'testContainer';

  function data(x, y) {
    return Handsontable.helper.createSpreadsheetData(x, y);
  }

  function countLines(str) {
    var lines = str.split('\r\n');
    return lines.length;
  }

  beforeEach(function () {
    this.$container = $("<div id=\"".concat(id, "\"></div>")).appendTo('body');
  });
  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });
  it('should export table when data source is defined as array of arrays', function () {
    handsontable({
      data: [[1, 'Foo"s', 'He\nis\nvery\nkind'], [2, 'Bar"s', 'He\nis\nvery\nconfident']]
    });

    var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

    expect(csv).toBe("\uFEFF1,\"Foo\"\"s\",\"He\nis\nvery\nkind\"\r\n2,\"Bar\"\"s\",\"He\nis\nvery\nconfident\"");
  });
  it('should export table when data source is defined as array of objects', function () {
    handsontable({
      data: [{
        id: 1,
        name: 'Foo"s',
        desc: 'He\nis\nvery\nkind'
      }, {
        id: 2,
        name: 'Bar"s',
        desc: 'He\nis\nvery\nconfident'
      }],
      columns: [{
        data: 'id'
      }, {
        data: 'name'
      }, {
        data: 'desc'
      }]
    });

    var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

    expect(csv).toBe("\uFEFF1,\"Foo\"\"s\",\"He\nis\nvery\nkind\"\r\n2,\"Bar\"\"s\",\"He\nis\nvery\nconfident\"");
  });
  it('should returns CSV type formatter object', function () {
    handsontable();

    var type = getPlugin('exportFile')._createTypeFormatter('csv');

    expect(type).toBeDefined();
  });
  describe('export options', function () {
    it('should have prepared default options', function () {
      handsontable();

      var csv = getPlugin('exportFile')._createTypeFormatter('csv');

      expect(csv.options.mimeType).toBe('text/csv');
      expect(csv.options.fileExtension).toBe('csv');
      expect(csv.options.bom).toBe(true);
      expect(csv.options.columnDelimiter).toBe(',');
      expect(csv.options.rowDelimiter).toBe('\r\n');
    });
  });
  describe('`export` method', function () {
    it('should returns string with corrected lines count', function () {
      handsontable({
        data: data(10, 10),
        height: 396,
        colHeaders: false,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect(10).toBe(countLines(csv));
    }); // BOM

    it('should export with default BOM', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,B1\r\nA2,B2").toBe(csv);
    });
    it('should export without any BOM', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        bom: false
      }).export();

      expect('A1,B1\r\nA2,B2').toBe(csv);
    }); // columnDelimiter

    it('should export with comma as the default columnDelimiter', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,B1\r\nA2,B2").toBe(csv);
    });
    it('should export regarding to columnDelimiter option', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        columnDelimiter: ';'
      }).export();

      expect("\uFEFFA1;B1\r\nA2;B2").toBe(csv);
    }); // rowDelimiter

    it('should export with CRLF as the default rowDelimiter', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,B1\r\nA2,B2").toBe(csv);
    });
    it('should export regarding to rowDelimiter option', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        rowDelimiter: '\n'
      }).export();

      expect("\uFEFFA1,B1\nA2,B2").toBe(csv);
    }); // columnHeaders

    it('should export with `false` as the default columnHeaders', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,B1\r\nA2,B2").toBe(csv);
    });
    it('should export regarding to columnHeaders option', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        columnHeaders: true
      }).export();

      expect("\uFEFF\"A\",\"B\"\r\nA1,B1\r\nA2,B2").toBe(csv);
    }); // rowHeaders

    it('should export with `false` as the default rowHeaders', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,B1\r\nA2,B2").toBe(csv);
    });
    it('should export regarding to rowHeaders option', function () {
      handsontable({
        data: data(2, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        rowHeaders: true
      }).export();

      expect("\uFEFF1,A1,B1\r\n2,A2,B2").toBe(csv);
    }); // exportHiddenRows

    it('should export with `false` as the default exportHiddenRows', function () {
      handsontable({
        data: data(5, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true,
        hiddenRows: {
          indicators: true,
          rows: [1, 2, 4]
        }
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,B1\r\nA4,B4").toBe(csv);
    });
    it('should export regarding to exportHiddenRows option', function () {
      handsontable({
        data: data(5, 2),
        height: 396,
        colHeaders: true,
        rowHeaders: true,
        hiddenRows: {
          indicators: true,
          rows: [1, 2, 4]
        }
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        exportHiddenRows: true
      }).export();

      expect("\uFEFFA1,B1\r\nA2,B2\r\nA3,B3\r\nA4,B4\r\nA5,B5").toBe(csv);
    }); // exportHiddenColumns

    it('should export with `false` as the default exportHiddenColumns', function () {
      handsontable({
        data: data(2, 5),
        height: 396,
        colHeaders: true,
        rowHeaders: true,
        hiddenColumns: {
          indicators: true,
          columns: [1, 2, 4]
        }
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,D1\r\nA2,D2").toBe(csv);
    });
    it('should export regarding to exportHiddenColumns option', function () {
      handsontable({
        data: data(2, 5),
        height: 396,
        colHeaders: true,
        rowHeaders: true,
        hiddenColumns: {
          indicators: true,
          columns: [1, 2, 4]
        }
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        exportHiddenColumns: true
      }).export();

      expect("\uFEFFA1,B1,C1,D1,E1\r\nA2,B2,C2,D2,E2").toBe(csv);
    }); // range

    it('should export all data by default', function () {
      handsontable({
        data: data(5, 5),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv').export();

      expect("\uFEFFA1,B1,C1,D1,E1\r\nA2,B2,C2,D2,E2\r\nA3,B3,C3,D3,E3\r\nA4,B4,C4,D4,E4\r\nA5,B5,C5,D5,E5").toBe(csv);
    });
    it('should export specified range from the middle of table', function () {
      handsontable({
        data: data(5, 5),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        range: [1, 1, 3, 2]
      }).export();

      expect("\uFEFFB2,C2\r\nB3,C3\r\nB4,C4").toBe(csv);
    });
    it('should export only specified row', function () {
      handsontable({
        data: data(5, 5),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        range: [1, 0, 1, 2]
      }).export();

      expect("\uFEFFA2,B2,C2").toBe(csv);
    });
    it('should export only specified column', function () {
      handsontable({
        data: data(5, 5),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        range: [0, 1, 4, 1]
      }).export();

      expect("\uFEFFB1\r\nB2\r\nB3\r\nB4\r\nB5").toBe(csv);
    });
    it('should export only existing data if "range" has coordinates defined out of scope', function () {
      handsontable({
        data: data(5, 5),
        height: 396,
        colHeaders: true,
        rowHeaders: true
      });

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        range: [4, 3, 40, 15]
      }).export();

      expect("\uFEFFD5,E5").toBe(csv);
    });
  });
  describe('`_escapeCell` method', function () {
    it('should not escape value if it is not necessary', function () {
      handsontable();

      var csv = getPlugin('exportFile')._createTypeFormatter('csv');

      expect(csv._escapeCell('')).toBe('');
      expect(csv._escapeCell('12345')).toBe('12345');
      expect(csv._escapeCell(null)).toBe('');
      expect(csv._escapeCell(void 0)).toBe('');
      expect(csv._escapeCell({})).toBe('[object Object]');
    });
    it('should escape value if it includes Carriage Return (CR)', function () {
      handsontable();

      var csv = getPlugin('exportFile')._createTypeFormatter('csv');

      expect(csv._escapeCell('1234\r22')).toBe('"1234\r22"');
    });
    it('should escape value if it includes Double Quote (")', function () {
      handsontable();

      var csv = getPlugin('exportFile')._createTypeFormatter('csv');

      expect(csv._escapeCell('123"42')).toBe('"123""42"');
    });
    it('should escape value if it includes Line Feed (LF)', function () {
      handsontable();

      var csv = getPlugin('exportFile')._createTypeFormatter('csv');

      expect(csv._escapeCell('123\n4')).toBe('"123\n4"');
    });
    it('should escape value if it includes char defined in `columnDelimiter` option', function () {
      handsontable();

      var csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        columnDelimiter: ','
      });

      expect(csv._escapeCell('12,4')).toBe('"12,4"');
      csv = getPlugin('exportFile')._createTypeFormatter('csv', {
        columnDelimiter: ';'
      });
      expect(csv._escapeCell('12;4')).toBe('"12;4"');
    });
  });
});