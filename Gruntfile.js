module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          index: './example/index.html',
          port: 8040,
          hostname: '*'
        }
      }
    },
    webpack: {
      compile: {
        entry: "./src/aquto.js",
        output: {
            path: "./",
            filename: "aquto.js",
            library: ["aquto"],
            libraryTarget: "var"
        }
      },
      watch: {
        entry: "./src/aquto.js",
        output: {
            path: "./",
            filename: "aquto.js",
            library: ["aquto"],
            libraryTarget: "var"
        },
        watch: true,
        keepalive: true
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'aquto.js',
        dest: 'aquto.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task(s).
  grunt.registerTask('default', ['webpack:compile', 'uglify']);
  grunt.registerTask('watch', ['webpack:watch']);
  grunt.registerTask('serve', ['connect:server', 'watch']);

};
