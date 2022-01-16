const std = @import("std");

const zig_bearssl_build = @import("deps/zig-http/deps/zig-bearssl/build.zig");
const zig_http_build = @import("deps/zig-http/build.zig");

const PROJECT_NAME = "wordle";

pub fn build(b: *std.build.Builder) void
{
    const mode = b.standardReleaseOptions();
    const target = b.standardTargetOptions(.{});

    const server = b.addExecutable(PROJECT_NAME, "src/server_main.zig");
    server.setBuildMode(mode);
    server.setTarget(target);
    zig_bearssl_build.addLib(server, target, "deps/zig-http/deps/zig-bearssl");
    // zig_http_build.addLibClient(server, target, "deps/zig-http");
    zig_http_build.addLibCommon(server, target, "deps/zig-http");
    zig_http_build.addLibServer(server, target, "deps/zig-http");
    server.linkLibC();
    const installDirRoot = std.build.InstallDir {
        .custom = "",
    };
    server.override_dest_dir = installDirRoot;
    server.install();

    // const installDirData = std.build.InstallDir {
    //     .custom = "data",
    // };
    // b.installDirectory(.{
    //     .source_dir = "data",
    //     .install_dir = installDirData,
    //     .install_subdir = "",
    // });

    const installDirScripts = std.build.InstallDir {
        .custom = "scripts",
    };
    b.installDirectory(.{
        .source_dir = "scripts",
        .install_dir = installDirScripts,
        .install_subdir = "",
    });

    const installDirStatic = std.build.InstallDir {
        .custom = "static",
    };
    b.installDirectory(.{
        .source_dir = "static",
        .install_dir = installDirStatic,
        .install_subdir = "",
    });

    // const runTests = b.step("test", "Run tests");

    // const testSrcs = [_][]const u8 {
    //     "src/auth.zig",
    //     "src/candidate.zig",
    //     "src/datetime.zig",
    //     "src/gmail.zig",
    //     "src/server_main.zig",
    //     "src/video.zig",
    //     // "src/wasm_main.zig",
    // };
    // for (testSrcs) |src| {
    //     const tests = b.addTest(src);
    //     tests.setBuildMode(mode);
    //     tests.setTarget(target);
    //     runTests.dependOn(&tests.step);
    // }
}
