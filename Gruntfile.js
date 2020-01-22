module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          index: './example/',
          port: 8040,
          hostname: '*'
        }
      }
    },
    webpack: {
      compile: {
        entry: {
          aquto: "./src/aquto.js",
          aquto_celtra: "./src/aquto.celtra.js",
        },
        output: {
          path: __dirname,
          filename: "[name].js",
          library: ["aquto"],
          libraryTarget: "var"
        },
        mode: 'production'
      },
      compileFlows: {
        entry: {
          aquto_flows: "./src/aquto.flows.js"
        },
        output: {
          path: __dirname,
          filename: "[name].js",
          library: ["aqutoFlows"],
          libraryTarget: "var"
        },
        mode: 'production'
      },
      watch: {
        entry: {
          aquto: "./src/aquto.js",
          aquto_celtra: "./src/aquto.celtra.js",
          aquto_flows: "./src/aquto.flows.js"
        },
        output: {
          path: __dirname,
          filename: "[name].js",
          library: ["aquto"],
          libraryTarget: "var"
        },
        watch: true,
        keepalive: true,
        mode: 'development'
      },
      watchFlows: {
        entry: {
          aquto_flows: "./src/aquto.flows.js"
        },
        output: {
          path: __dirname,
          filename: "[name].js",
          library: ["aqutoFlows"],
          libraryTarget: "var"
        },
        watch: true,
        keepalive: true,
        mode: 'development'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'aquto.min.js': ['aquto.js'],
          'aquto_celtra.min.js': ['aquto_celtra.js'],
          'aquto_flows.min.js': ['aquto_flows.js'],
          'flows/vast/src/js/custom.min.js': ['flows/vast/src/js/custom.js']
        }
      }
    },
    concat: {
      css: {
        src: ['flows/vast/src/css/aquto.skin.css', 'flows/vast/src/css/loading.css', 'flows/vast/src/css/style.css'],
        dest: 'flows/vast/src/css/styles.css'
      }
    },
    inline: {
      dist: {
        options:{
          cssmin: true
        },
        src: 'flows/vast/src/tag.html',
        dest: 'flows/vast/inlined.html'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true
        },
        files: {
          'flows/vast/tag/v1.html': 'flows/vast/inlined.html'
        }
      },
      dev: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true
        },
        files: {
          'flows/vast/tag/v1.html': 'flows/vast/inlined.html'
        }
      }
    },
    clean: ['flows/vast/inlined.html', 'flows/vast/src/css/styles.css', 'flows/vast/src/js/custom.min.js']
  });


  // Load plugins
  grunt.loadNpmTasks('grunt-webpack');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-uglify-es'); // supports ES6 syntax
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['webpack:compile', 'webpack:compileFlows', 'uglify']);
  grunt.registerTask('watch', ['webpack:watch']);
  grunt.registerTask('serve', ['connect:server', 'watch']);
  // PhoneEntry task(s)
  grunt.registerTask('watchFlows', ['webpack:watchFlows']);
  grunt.registerTask('serveFlows', ['connect:server', 'watchFlows']);

  // vast project task(s).
  grunt.registerTask('minifyHtml', ['htmlmin']);
  grunt.registerTask('vast', ['default', 'concat', 'inline', 'minifyHtml', 'clean']);
};
