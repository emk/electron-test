extern crate env_logger;
#[macro_use]
extern crate log;
#[macro_use]
extern crate neon;

use neon::js::{JsNull, JsString};
use neon::vm::{Call, JsResult};

// Initialize this extension.
fn init(_call: Call) -> JsResult<JsNull> {
    env_logger::init().expect("could not initialize env_logger");
    Ok(JsNull::new())
}

fn hello(call: Call) -> JsResult<JsString> {
    let scope = call.scope;
    Ok(JsString::new(scope, "Hello, world!").unwrap())
}

register_module!(m, {
    try!(m.export("init", init));
    m.export("hello", hello)
});
