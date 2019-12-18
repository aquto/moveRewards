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
          aquto_celtra: "./src/aquto.celtra.js"
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
          'aquto_flows.min.js': ['aquto_flows.js']
        }
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['webpack:compile', 'webpack:compileFlows', 'uglify']);
  grunt.registerTask('watch', ['webpack:watch']);
  grunt.registerTask('serve', ['connect:server', 'watch']);

};
